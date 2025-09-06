import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, FlatList, Platform, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import type { ViewStyle, TextStyle } from 'react-native';
import { Session, Attempt, GradeSystem } from '../models/Session';
import { convertGrade } from '../models/gradeConversion';
import store from '../storage/simpleStore';
import { colors } from '../theme';
import BoulderRow from '../components/BoulderRow';
import BoulderPill from '../components/BoulderPill';
import BoulderModal from '../components/BoulderModal';
import styles from './LogScreen.styles';

import { V_GRADES, FONT_GRADES } from '../models/grades';

export default function LogScreen() {
  // Updated grade conversion maps (with ranges)
  // State hooks
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dateObj, setDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gradeSystem, setGradeSystem] = useState<GradeSystem>('V');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [boulders, setBoulders] = useState<Attempt[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  // Modal state for adding boulders
  const [modalGrade, setModalGrade] = useState(V_GRADES[0]);
  // Sync modalGrade with gradeSystem when modal is open
  React.useEffect(() => {
    if (modalVisible) {
      setModalGrade(gradeSystem === 'V' ? V_GRADES[0] : FONT_GRADES[0]);
    }
  }, [gradeSystem, modalVisible]);
  const [modalFlashed, setModalFlashed] = useState(false);
  const [modalAttempts, setModalAttempts] = useState<number>(1);

  // Handlers
  const handleDateChange = (selectedDate: Date) => {
    setShowDatePicker(false);
    setDateObj(selectedDate);
    setDate(selectedDate.toISOString().slice(0, 10));
  };

  const openAddBoulder = () => {
    setModalGrade(gradeSystem === 'V' ? V_GRADES[0] : FONT_GRADES[0]);
    setModalFlashed(false);
    setModalAttempts(1);
    setModalVisible(true);
  };

  const addBoulder = () => {
    // If only one attempt and flash not selected, treat as flash
    const isFlash = modalAttempts === 1 ? true : modalFlashed;
    const attempt: Attempt = {
      grade: modalGrade,
      attempts: modalAttempts,
      flashed: isFlash,
    };
    setBoulders(prev => [...prev, attempt]);
    setModalVisible(false);
  };

  const removeBoulder = (index: number) => {
    setBoulders(prev => prev.filter((_, i) => i !== index));
  };

  // Aggregate boulders by grade
  const gradeSummary = boulders.reduce<Record<string, { flash: number; total: number }>>((acc, b) => {
    if (!acc[b.grade]) acc[b.grade] = { flash: 0, total: 0 };
    acc[b.grade].total += 1;
    if (b.flashed) acc[b.grade].flash += 1;
    return acc;
  }, {});

  return (
  <View style={[styles.container, { flex: 1 }]}> 
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={120}
      >
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <Text style={{ color: colors.text, fontSize: 16 }}>{date}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          date={dateObj}
          maximumDate={new Date()}
          onConfirm={handleDateChange}
          onCancel={() => setShowDatePicker(false)}
        />
        <Text style={styles.label}>Grade System</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Pressable
            style={[styles.button, gradeSystem === 'V' && styles.buttonPrimary, { flex: 1, marginRight: 8 }]}
            onPress={() => {
              setGradeSystem('V');
              setModalGrade(V_GRADES[0]);
            }}
          >
            <Text style={[styles.buttonText, gradeSystem === 'V' && styles.buttonTextPrimary]}>V-Scale</Text>
          </Pressable>
          <Pressable
            style={[styles.button, gradeSystem === 'Font' && styles.buttonPrimary, { flex: 1 }]}
            onPress={() => {
              setGradeSystem('Font');
              setModalGrade(FONT_GRADES[0]);
            }}
          >
            <Text style={[styles.buttonText, gradeSystem === 'Font' && styles.buttonTextPrimary]}>Font</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>Session Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g. 90"
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
        <Text style={styles.label}>Boulders</Text>
        <TouchableOpacity style={styles.buttonPrimary} onPress={openAddBoulder}>
          <Text style={styles.buttonTextPrimary}>Add Boulder</Text>
        </TouchableOpacity>
        <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginTop: 8, justifyContent: 'center' }}>
          {Object.entries(gradeSummary).length === 0 ? (
            <Text style={{ color: '#888', marginVertical: 8 }}>No boulders added yet.</Text>
          ) : (
            (() => {
              const gradeOrder = gradeSystem === 'V' ? V_GRADES : FONT_GRADES;
              return Object.entries(gradeSummary)
                .sort(([a], [b]) => {
                  const idxA = gradeOrder.indexOf(convertGrade(a, gradeSystem));
                  const idxB = gradeOrder.indexOf(convertGrade(b, gradeSystem));
                  // If not found, sort alphabetically
                  if (idxA === -1 && idxB === -1) return a.localeCompare(b);
                  if (idxA === -1) return 1;
                  if (idxB === -1) return -1;
                  return idxA - idxB;
                })
                .map(([grade, { flash, total }]) => (
                  <BoulderPill key={grade} grade={convertGrade(grade, gradeSystem)} flash={flash} total={total} originalGrade={grade} />
                ));
            })()
          )}
        </View>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 60 }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Session notes (optional)"
          multiline
          placeholderTextColor={colors.text}
        />
  </KeyboardAwareScrollView>
      <BoulderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(grade, attempts, flashed) => {
          setBoulders(prev => [
            ...prev,
            { grade, attempts, flashed }
          ]);
          setModalVisible(false);
        }}
        gradeSystem={gradeSystem}
      />
    </View>
  );
}

