import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { Session } from '../models/Session';
import type { Boulder } from '../models/Boulder';
import { getGradeSystem } from '../../grades/services/gradeSystemService';
import { colors } from '../../../shared/design/theme';
import BoulderList from './BoulderList';
import { styles } from './SessionEditModal.styles';

interface SessionEditModalProps {
  visible: boolean;
  session: Session | null;
  pickerOpenIndex: number | null;
  setPickerOpenIndex: (i: number | null) => void;
  onChange: (session: Session) => void;
  onCancel: () => void;
  onSave: () => void;
}

const SessionEditModal: React.FC<SessionEditModalProps> = ({
  visible,
  session,
  pickerOpenIndex,
  setPickerOpenIndex,
  onChange,
  onCancel,
  onSave,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.container}>
            <ScrollView>
              <Text style={styles.title}>Edit Session</Text>
              {session && (
                <>
                  <Text style={styles.label}>Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={session.date}
                    onChangeText={val => onChange({ ...session, date: val })}
                  />
                  <Text style={styles.label}>Duration (min)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={String(session.durationMinutes ?? '')}
                    keyboardType="numeric"
                    onChangeText={val => onChange({ ...session, durationMinutes: Number(val.replace(/[^0-9]/g, '')) })}
                  />
                  <Text style={styles.label}>Notes</Text>
                  <TextInput
                    style={styles.textInput}
                    value={session.notes}
                    onChangeText={val => onChange({ ...session, notes: val })}
                  />
                  <Text style={styles.bouldersTitle}>Boulders</Text>
                  <BoulderList
                    boulders={session.boulders ?? []}
                    gradeSystem={typeof session.gradeSystem === 'string' ? session.gradeSystem : 'V'}
                    pickerOpenIndex={pickerOpenIndex}
                    setPickerOpenIndex={setPickerOpenIndex}
                    onChange={(boulders: Boulder[]) => onChange({ ...session, boulders })}
                  />
                  <TouchableOpacity
                    style={styles.addBoulderButton}
                    onPress={() => {
                      const updated = Array.isArray(session.boulders) ? [...session.boulders] : [];
                      const sys = getGradeSystem(
                        session.gradeSystem === 'V'
                          ? 'vscale'
                          : session.gradeSystem === 'Font'
                            ? 'font'
                            : (session.gradeSystem as string)
                      );
                      const first = sys?.grades?.[0]?.label || '';
                      updated.push({ grade: first, attempts: 1, flashed: true });
                      onChange({ ...session, boulders: updated });
                    }}
                  >
                    <Text style={styles.buttonText}>Add Boulder</Text>
                  </TouchableOpacity>
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default SessionEditModal;
