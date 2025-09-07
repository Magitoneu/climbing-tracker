
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform, Animated, Modal, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import store from '../storage/simpleStore';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { V_GRADES, FONT_GRADES } from '../models/grades';
import { aggregateBoulders, getMaxGrade, Boulder as BoulderType } from '../utils/boulderUtils';
import SessionEditModal from '../components/SessionEditModal';
import BoulderList from '../components/BoulderList';
import type { Session } from '../models/Session';
import type { Boulder } from '../models/Boulder';

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
      let isActive = true;
      (async () => {
        try {
          const data = await store.getItem('sessions');
          let parsed = [];
          if (data) {
            parsed = JSON.parse(data);
            if (!Array.isArray(parsed)) parsed = [];
          }
          if (isActive) setSessions(parsed);
        } catch {
          if (isActive) setSessions([]);
        }
      })();
      return () => { isActive = false; };
    }, [])
  );

  return (
  <View style={{ flex: 1, backgroundColor: colors.background, padding: 2 }}>
  {(!sessions || sessions.length === 0) ? (
  <Text style={{ color: colors.text, opacity: 0.5, fontSize: 16, textAlign: 'center', marginTop: 32 }}>No sessions logged yet.</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => {
            const boulders: Boulder[] = Array.isArray(item.boulders) ? item.boulders : [];
            const duration = item.durationMinutes || 0;
            const maxGrade = boulders.length > 0 ? getMaxGrade(boulders, item.gradeSystem) : '—';
            const totalBoulders = boulders.length;
            const flashCount = boulders.filter(b => b.flashed).length;
            // Color accent by grade system
            const accentColor = item.gradeSystem === 'V' ? colors.primary : colors.accent;
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
              const updated = sessions.filter((_, i) => i !== index);
              setSessions(updated);
              await store.setItem('sessions', JSON.stringify(updated));
            };

            // Edit handler
            const handleEdit = () => {
              setEditSessionIndex(index);
              setEditSession({ ...item });
              setEditModalVisible(true);
            };

            return (
              <Animated.View
                style={{
                  transform: [{ translateX: swipeX }],
                  marginBottom: 16,
                }}
                {...{
                  onStartShouldSetResponder: () => true,
                  onResponderMove: (e) => {
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
                  <View style={{
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    shadowColor: colors.primary,
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 3,
                    overflow: 'hidden',
                  }}>
                    <View style={{ height: 6, backgroundColor: accentColor }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                      <Ionicons name="calendar" size={22} color={accentColor} style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: accentColor, flex: 1 }}>{item.date}</Text>
                      <MaterialCommunityIcons name="trophy" size={22} color={accentColor} style={{ marginRight: 4 }} />
                      <Text style={{ fontSize: 16, color: accentColor }}>{maxGrade}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="time" size={18} color={colors.text} style={{ marginRight: 4, opacity: 0.7 }} />
                        <Text style={{ fontSize: 14, color: colors.text, opacity: 0.7 }}>{duration} min</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="carabiner" size={18} color={colors.text} style={{ marginRight: 4, opacity: 0.7 }} />
                        <Text style={{ fontSize: 14, color: colors.text, opacity: 0.7 }}>{totalBoulders} boulders</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="flash" size={18} color={colors.flash} style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 14, color: colors.text, opacity: 0.7 }}>{flashCount} / {totalBoulders} flashes</Text>
                      </View>
                    </View>
                    {/* Expanded details */}
                    {expandedIndex === index && (
                      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: accentColor, marginBottom: 6 }}>Boulders:</Text>
                        {boulders.length === 0 ? (
                          <Text style={{ color: colors.text, opacity: 0.7 }}>No boulders logged.</Text>
                        ) : (
                          boulders.map((b, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                              <MaterialCommunityIcons name="circle" size={12} color={colors.primary} style={{ marginRight: 6 }} />
                              <Text style={{ fontSize: 14, color: colors.text }}>{b.grade}</Text>
                              {b.flashed && (
                                <Ionicons name="flash" size={14} color={colors.flash} style={{ marginLeft: 6 }} />
                              )}
                            </View>
                          ))
                        )}
                        {item.notes ? (
                          <Text style={{ fontSize: 13, color: colors.text, opacity: 0.7, marginTop: 8, fontStyle: 'italic' }}>“{item.notes}”</Text>
                        ) : null}
                        {/* Edit/Delete actions */}
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                          <TouchableOpacity
                            style={{ backgroundColor: colors.error, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16, marginRight: 8 }}
                            onPress={handleDelete}
                          >
                            <Text style={{ color: colors.surface, fontWeight: 'bold' }}>Delete</Text>
                          </TouchableOpacity>
                          {/* Placeholder for Edit */}
                          <TouchableOpacity
                            style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16 }}
                            onPress={handleEdit}
                          >
                            <Text style={{ color: colors.surface, fontWeight: 'bold' }}>Edit</Text>
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
            const updated = [...sessions];
            updated[editSessionIndex] = editSession;
            setSessions(updated);
            await store.setItem('sessions', JSON.stringify(updated));
            setEditModalVisible(false);
          }
        }}
      />
    </View>
  );
}
