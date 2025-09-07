// ...existing code...
import { getSelectedGradeSystem } from '../storage/customGradeSystemStore';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { aggregateBoulders, sortGrades, getMaxGrade, Boulder as BoulderType } from '../utils/boulderUtils';

export default function LogScreen() {
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
  // Sync grade system from settings
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      getSelectedGradeSystem().then(system => {
        if (isActive) setGradeSystem(system);
      });
      return () => { isActive = false; };
    }, [])
  );
  // Sync modalGrade with gradeSystem when modal is open
  React.useEffect(() => {
    if (modalVisible) {
      if (gradeSystem === 'V') setModalGrade(V_GRADES[0]);
      else if (gradeSystem === 'Font') setModalGrade(FONT_GRADES[0]);
      else setModalGrade(''); // fallback for custom systems
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
  const gradeSummary = aggregateBoulders(boulders);

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
                  const idxA = gradeOrder.indexOf(
                    (gradeSystem === 'V' || gradeSystem === 'Font') ? convertGrade(a, gradeSystem) : a
                  );
                  const idxB = gradeOrder.indexOf(
                    (gradeSystem === 'V' || gradeSystem === 'Font') ? convertGrade(b, gradeSystem) : b
                  );
                  // If not found, sort alphabetically
                  if (idxA === -1 && idxB === -1) return a.localeCompare(b);
                  if (idxA === -1) return 1;
                  if (idxB === -1) return -1;
                  return idxA - idxB;
                })
                .map(([grade, { flashed, total }]) => (
                  <BoulderPill key={grade} grade={(gradeSystem === 'V' || gradeSystem === 'Font') ? convertGrade(grade, gradeSystem) : grade} flash={flashed} total={total} originalGrade={grade} />
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
        <TouchableOpacity
          style={[styles.buttonPrimary, { marginTop: 24, marginBottom: 8 }]}
          onPress={async () => {
            if (!duration || boulders.length === 0) {
              Alert.alert('Please enter duration and add at least one boulder.');
              return;
            }
            const session = {
              date,
              duration: parseInt(duration),
              notes,
              boulders,
              gradeSystem,
            };
            try {
              const prev = await store.getItem('sessions');
              const sessions = prev ? JSON.parse(prev) : [];
              sessions.push(session);
              await store.setItem('sessions', JSON.stringify(sessions));
              Alert.alert('Session saved!');
              // Clear form fields after saving
              setBoulders([]);
              setNotes('');
              setDuration('');
              setGradeSystem('V');
              setDate(() => new Date().toISOString().slice(0, 10));
              setDateObj(new Date());
            } catch (e) {
              Alert.alert('Error saving session');
            }
          }}
        >
          <Text style={styles.buttonTextPrimary}>Save Session</Text>
        </TouchableOpacity>
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
  gradeSystem={(gradeSystem === 'V' || gradeSystem === 'Font') ? gradeSystem : 'V'}
      />
    </View>
  );
}

