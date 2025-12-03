import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Animated,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import store from '../../../storage/simpleStore';
import { subscribeToSessions, CloudSession, updateSession, deleteSession } from '../services/sessionService';
import { Alert } from 'react-native';
import { auth } from '../../../config/firebase';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../../shared/design/theme';
import { V_GRADES, FONT_GRADES } from '../../grades/models/grades';
// Display original logged grades only (no conversion)
import { getGradeSystem } from '../../grades/services/gradeSystemService';
import { aggregateBoulders, getMaxGrade, Boulder as BoulderType } from '../utils/boulderUtils';
import SessionEditModal from '../components/SessionEditModal';
import BoulderList from '../components/BoulderList';
import type { Session } from '../models/Session';
import type { Boulder } from '../models/Boulder';
import { styles, getDynamicStyles } from './SessionsScreen.styles';

export default function SessionsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editSessionIndex, setEditSessionIndex] = useState<number | null>(null);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null);

  // Enable LayoutAnimation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      let unsubscribe: (() => void) | null = null;

      const attach = async () => {
        // If not authenticated yet, just load local fallback
        if (!auth.currentUser) {
          try {
            const data = await store.getItem('sessions');
            const parsed = data ? JSON.parse(data) : [];
            if (!cancelled) setSessions(parsed);
          } catch {
            // Failed to load local sessions - display empty list
            if (!cancelled) setSessions([]);
          }
          return;
        }
        try {
          unsubscribe = subscribeToSessions(async cloudSessions => {
            if (cancelled) return;
            // Normalize shape to existing UI expectations
            const mapped = cloudSessions.map(s => ({
              id: s.id,
              date: s.date,
              durationMinutes: typeof s.durationMinutes === 'number' ? s.durationMinutes : undefined,
              notes: s.notes,
              gradeSystem: s.gradeSystem,
              boulders:
                Array.isArray(s.boulders) && s.boulders.length > 0
                  ? s.boulders
                  : Array.isArray(s.attempts)
                    ? s.attempts.map(a => ({ grade: a.grade, flashed: a.flashed, attempts: a.attempts }))
                    : [],
              attempts: Array.isArray(s.attempts) ? s.attempts : [],
            }));
            setSessions(mapped as any);
            // Cache locally for offline
            try {
              await store.setItem('sessions', JSON.stringify(mapped));
            } catch {
              // Non-critical: silently fail to cache sessions locally
            }
          });
        } catch (e) {
          console.warn('[Sessions] Live subscribe failed, using local cache', (e as any)?.message);
          try {
            const data = await store.getItem('sessions');
            const parsed = data ? JSON.parse(data) : [];
            if (!cancelled) setSessions(parsed);
          } catch {
            // Failed to load local fallback sessions - display empty list
            if (!cancelled) setSessions([]);
          }
        }
      };

      attach();
      return () => {
        cancelled = true;
        if (unsubscribe) unsubscribe();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {!sessions || sessions.length === 0 ? (
        <Text style={styles.emptyText}>No sessions logged yet.</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => {
            const boulders: Boulder[] = Array.isArray(item.boulders) ? item.boulders : [];
            const duration = item.durationMinutes || 0;
            const maxGrade =
              boulders.length > 0
                ? (() => {
                    // Prefer canonical ranking to find the hardest, but display original label only
                    const enriched = boulders.map(b => ({
                      b,
                      cv: (b as any).canonicalValue ?? (b as any).gradeSnapshot?.canonicalValue,
                    }));
                    const top = enriched.filter(e => e.cv != null).sort((a, b) => b.cv! - a.cv!)[0];
                    if (top) {
                      const original = (top.b as any).gradeSnapshot?.originalLabel || top.b.grade;
                      return original || '—';
                    }
                    // Fallback if no canonical values: use the session's own system ordering if available
                    const sysId = ((): string => {
                      const gs = item.gradeSystem;
                      if (gs === 'V') return 'vscale';
                      if (gs === 'Font') return 'font';
                      return typeof gs === 'string' ? gs : 'vscale';
                    })();
                    const sys = getGradeSystem(sysId);
                    if (sys) {
                      const order = sys.grades.map(g => g.label);
                      let bestLabel: string | null = null;
                      let bestIdx = -1;
                      for (const b of boulders) {
                        const label = (b as any).gradeSnapshot?.originalLabel || b.grade;
                        const idx = order.indexOf(label);
                        if (idx > bestIdx) {
                          bestIdx = idx;
                          bestLabel = label;
                        }
                      }
                      if (bestLabel) return bestLabel;
                    }
                    // Last resort: alphabetical max
                    return (
                      boulders
                        .map(b => (b as any).gradeSnapshot?.originalLabel || b.grade)
                        .sort()
                        .slice(-1)[0] || '—'
                    );
                  })()
                : '—';
            const totalBoulders = boulders.length;
            const flashCount = boulders.filter(b => b.flashed).length;
            // Color accent by grade system
            const accentColor = item.gradeSystem === 'V' ? colors.primary : colors.accent;
            const dynamicStyles = getDynamicStyles(accentColor);
            // Swipe-to-delete state
            const swipeX = new Animated.Value(0);
            let swiped = false;

            // Expand/collapse handler
            const handleExpand = () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setExpandedIndex(expandedIndex === index ? null : index);
            };

            // Delete handler
            const handleDelete = async () => {
              const target = sessions[index];
              // Optimistic local removal
              const updated = sessions.filter((_, i) => i !== index);
              setSessions(updated);
              try {
                await store.setItem('sessions', JSON.stringify(updated));
              } catch {
                // Non-critical: silently fail to update local cache after delete
              }
              if (target?.id && auth.currentUser) {
                try {
                  await deleteSession(target.id);
                  // success - subscription will keep us in sync
                } catch (e: any) {
                  console.warn('[Sessions] Cloud delete failed, restoring locally', e?.message);
                  Alert.alert('Delete failed (offline)', 'Will retry when connection returns.');
                  // Restore locally if failed
                  const restored = [...updated];
                  restored.splice(index, 0, target);
                  setSessions(restored);
                  try {
                    await store.setItem('sessions', JSON.stringify(restored));
                  } catch {
                    // Non-critical: silently fail to restore session to local cache
                  }
                }
              }
            };

            // Edit handler
            const handleEdit = () => {
              setEditSessionIndex(index);
              setEditSession({ ...item });
              setEditModalVisible(true);
            };

            return (
              <Animated.View
                style={[
                  styles.sessionCard,
                  {
                    transform: [{ translateX: swipeX }],
                  },
                ]}
                {...{
                  onStartShouldSetResponder: () => true,
                  onResponderMove: e => {
                    const dx = e.nativeEvent.pageX - e.nativeEvent.locationX;
                    if (dx < -60 && !swiped) {
                      swiped = true;
                      Animated.timing(swipeX, {
                        toValue: -100,
                        duration: 200,
                        useNativeDriver: true,
                      }).start();
                    }
                  },
                  onResponderRelease: () => {
                    if (swiped) {
                      handleDelete();
                      Animated.timing(swipeX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                      }).start();
                      swiped = false;
                    }
                  },
                }}
              >
                <TouchableOpacity activeOpacity={0.85} onPress={handleExpand}>
                  <View style={styles.card}>
                    <View style={[styles.accentBar, dynamicStyles.accentBar]} />
                    <View style={styles.headerRow}>
                      <Ionicons name="calendar" size={22} color={accentColor} style={styles.iconMarginRight} />
                      <Text style={[styles.dateText, dynamicStyles.dateText]}>{item.date}</Text>
                      <MaterialCommunityIcons
                        name="trophy"
                        size={22}
                        color={accentColor}
                        style={styles.iconMarginRight4}
                      />
                      <Text style={[styles.maxGradeText, dynamicStyles.maxGradeText]}>{maxGrade}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Ionicons name="time" size={18} color={colors.text} style={styles.iconWithOpacity} />
                        <Text style={styles.statText}>{duration} min</Text>
                      </View>
                      <View style={styles.statItem}>
                        <MaterialCommunityIcons
                          name="carabiner"
                          size={18}
                          color={colors.text}
                          style={styles.iconWithOpacity}
                        />
                        <Text style={styles.statText}>{totalBoulders} boulders</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="flash" size={18} color={colors.flash} style={styles.iconMarginRight4} />
                        <Text style={styles.flashText}>
                          {flashCount} / {totalBoulders} flashes
                        </Text>
                      </View>
                    </View>
                    {/* Expanded details */}
                    {expandedIndex === index && (
                      <View style={styles.expandedContainer}>
                        <Text style={[styles.expandedTitle, dynamicStyles.expandedTitle]}>Boulders:</Text>
                        {boulders.length === 0 ? (
                          <Text style={styles.noBoulders}>No boulders logged.</Text>
                        ) : (
                          boulders.map((b, i) => {
                            const original = (b as any).gradeSnapshot?.originalLabel || b.grade;
                            return (
                              <View key={i} style={styles.boulderRow}>
                                <MaterialCommunityIcons
                                  name="circle"
                                  size={12}
                                  color={colors.primary}
                                  style={styles.boulderCircle}
                                />
                                <Text style={styles.boulderGradeText}>{original}</Text>
                                {b.flashed && (
                                  <Ionicons name="flash" size={14} color={colors.flash} style={styles.flashIcon} />
                                )}
                              </View>
                            );
                          })
                        )}
                        {item.notes ? <Text style={styles.notesText}>&ldquo;{item.notes}&rdquo;</Text> : null}
                        {/* Edit/Delete actions */}
                        <View style={styles.actionRow}>
                          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Text style={styles.buttonText}>Delete</Text>
                          </TouchableOpacity>
                          {/* Placeholder for Edit */}
                          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                            <Text style={styles.buttonText}>Edit</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      )}
      <SessionEditModal
        visible={editModalVisible}
        session={editSession}
        pickerOpenIndex={pickerOpenIndex}
        setPickerOpenIndex={setPickerOpenIndex}
        onChange={s => setEditSession(s)}
        onCancel={() => setEditModalVisible(false)}
        onSave={async () => {
          if (editSessionIndex !== null && editSession) {
            const prev = sessions[editSessionIndex];
            const updatedList = [...sessions];
            updatedList[editSessionIndex] = editSession;
            setSessions(updatedList);
            try {
              await store.setItem('sessions', JSON.stringify(updatedList));
            } catch {
              // Non-critical: silently fail to update local cache after edit
            }
            setEditModalVisible(false);
            // Cloud update if possible
            if (editSession.id && auth.currentUser) {
              try {
                await updateSession(editSession.id, {
                  date: editSession.date,
                  durationMinutes: editSession.durationMinutes,
                  notes: editSession.notes,
                  gradeSystem: editSession.gradeSystem,
                  attempts:
                    Array.isArray(editSession.attempts) && editSession.attempts.length > 0
                      ? editSession.attempts
                      : (editSession.boulders || []).map(b => ({
                          grade: b.grade,
                          attempts: b.attempts ?? 1,
                          flashed: b.flashed,
                        })),
                  boulders: editSession.boulders || [],
                } as any);
                // Success: subscription will reflect final state
              } catch (e: any) {
                console.warn('[Sessions] Cloud update failed, keeping local version', e?.message);
                Alert.alert('Update saved locally', 'Could not sync to cloud (offline).');
              }
            }
          }
        }}
      />
    </View>
  );
}
