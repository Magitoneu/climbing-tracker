
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform, Animated, Modal, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import store from '../storage/simpleStore';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { V_GRADES, FONT_GRADES } from '../models/grades';

export default function SessionsScreen() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editSessionIndex, setEditSessionIndex] = useState<number | null>(null);
  const [editSession, setEditSession] = useState<any | null>(null);
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
            type Boulder = { grade: string; flashed: boolean };
            const boulders: Boulder[] = Array.isArray(item.boulders) ? item.boulders : [];
            const duration = item.duration || 0;
            const gradeOrder = item.gradeSystem === 'V' ? V_GRADES : FONT_GRADES;
            const maxGrade = boulders.length > 0
              ? boulders.reduce<string | null>((max: string | null, b: Boulder) => {
                  if (max === null) return b.grade;
                  const idxB = gradeOrder.indexOf(b.grade);
                  const idxMax = gradeOrder.indexOf(max);
                  return idxB > idxMax ? b.grade : max;
                }, null)
              : '—';
            const totalBoulders = boulders.length;
            const flashCount = boulders.filter((b: Boulder) => b.flashed).length;
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
      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '90%', maxHeight: '90%' }}
            >
              <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 24, width: '100%', maxHeight: '100%' }}>
                <ScrollView>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 16 }}>Edit Session</Text>
              {editSession && (
                <>
                  <Text style={{ fontSize: 14, color: colors.text, marginBottom: 4 }}>Date</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 12, color: colors.text }}
                    value={editSession.date}
                    onChangeText={val => setEditSession({ ...editSession, date: val })}
                  />
                  <Text style={{ fontSize: 14, color: colors.text, marginBottom: 4 }}>Duration (min)</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 12, color: colors.text }}
                    value={String(editSession.duration)}
                    keyboardType="numeric"
                    onChangeText={val => setEditSession({ ...editSession, duration: val.replace(/[^0-9]/g, '') })}
                  />
                  <Text style={{ fontSize: 14, color: colors.text, marginBottom: 4 }}>Notes</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 12, color: colors.text }}
                    value={editSession.notes}
                    onChangeText={val => setEditSession({ ...editSession, notes: val })}
                  />
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: colors.primary, marginBottom: 8 }}>Boulders</Text>
                  {Array.isArray(editSession.boulders) && editSession.boulders.length > 0 ? (
                    editSession.boulders.map((b: any, i: number) => (
                      <View key={i} style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: colors.primary, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <Text style={{ fontSize: 13, color: colors.text, fontWeight: 'bold' }}>Boulder {i + 1}</Text>
                          {b.flashed && (
                            <Ionicons
                              name="flash"
                              size={18}
                              color={colors.flash || colors.primary}
                              style={{ marginLeft: 6 }}
                            />
                          )}
                        </View>
                        {/* <Text style={{ fontSize: 13, color: colors.text, marginBottom: 2 }}>Grade</Text> */}
                        {pickerOpenIndex !== i ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 15, color: colors.primary, fontWeight: 'bold', marginRight: 8 }}>{b.grade}</Text>
                            <TouchableOpacity
                              style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}
                              onPress={() => setPickerOpenIndex(i)}
                            >
                              <Text style={{ color: colors.surface }}>Change Grade</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 8 }}>
                            <Picker
                              selectedValue={b.grade}
                              onValueChange={val => {
                                const updated = [...editSession.boulders];
                                updated[i].grade = val;
                                setEditSession({ ...editSession, boulders: updated });
                                setPickerOpenIndex(null);
                              }}
                              style={{ color: colors.text }}
                            >
                              {(editSession.gradeSystem === 'V' ? V_GRADES : FONT_GRADES).map(g => (
                                <Picker.Item key={g} label={g} value={g} />
                              ))}
                            </Picker>
                          </View>
                        )}
                        <Text style={{ fontSize: 13, color: colors.text, marginBottom: 2 }}>Attempts</Text>
                        <TextInput
                          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 8, color: colors.text }}
                          value={String(b.attempts)}
                          keyboardType="numeric"
                            onChangeText={val => {
                              const updated = [...editSession.boulders];
                              const attempts = val.replace(/[^0-9]/g, '');
                              updated[i].attempts = attempts;
                              updated[i].flashed = attempts === '1';
                              setEditSession({ ...editSession, boulders: updated });
                            }}
                        />
                        <TouchableOpacity
                          style={{ backgroundColor: colors.error, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16, alignSelf: 'flex-end' }}
                          onPress={() => {
                            const updated = [...editSession.boulders];
                            updated.splice(i, 1);
                            setEditSession({ ...editSession, boulders: updated });
                          }}
                        >
                          <Text style={{ color: colors.surface }}>Remove Boulder</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: colors.text, opacity: 0.7 }}>No boulders logged.</Text>
                  )}
                  {/* Add boulder button */}
                  <TouchableOpacity
                    style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16, alignSelf: 'flex-start', marginBottom: 12 }}
                    onPress={() => {
                      const updated = Array.isArray(editSession.boulders) ? [...editSession.boulders] : [];
                      updated.push({ grade: (editSession.gradeSystem === 'V' ? V_GRADES[0] : FONT_GRADES[0]), attempts: 1, flashed: true });
                      setEditSession({ ...editSession, boulders: updated });
                    }}
                  >
                    <Text style={{ color: colors.surface, fontWeight: 'bold' }}>Add Boulder</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                    <TouchableOpacity
                      style={{ backgroundColor: colors.error, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginRight: 8 }}
                      onPress={() => setEditModalVisible(false)}
                    >
                      <Text style={{ color: colors.surface, fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18 }}
                      onPress={async () => {
                        if (editSessionIndex !== null) {
                          const updated = [...sessions];
                          updated[editSessionIndex] = editSession;
                          setSessions(updated);
                          await store.setItem('sessions', JSON.stringify(updated));
                          setEditModalVisible(false);
                        }
                      }}
                    >
                      <Text style={{ color: colors.surface, fontWeight: 'bold' }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
