import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { Session } from '../models/Session';
import type { Boulder } from '../models/Boulder';
import { V_GRADES, FONT_GRADES } from '../models/grades';
import { colors } from '../theme';
import BoulderList from './BoulderList';

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
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '90%', maxHeight: '90%' }}
        >
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 24, width: '100%', maxHeight: '100%' }}>
            <ScrollView>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 16 }}>Edit Session</Text>
              {session && (
                <>
                  <Text style={{ fontSize: 14, color: colors.text, marginBottom: 4 }}>Date</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 12, color: colors.text }}
                    value={session.date}
                    onChangeText={val => onChange({ ...session, date: val })}
                  />
                  <Text style={{ fontSize: 14, color: colors.text, marginBottom: 4 }}>Duration (min)</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 12, color: colors.text }}
                    value={String(session.durationMinutes ?? '')}
                    keyboardType="numeric"
                    onChangeText={val => onChange({ ...session, durationMinutes: Number(val.replace(/[^0-9]/g, '')) })}
                  />
                  <Text style={{ fontSize: 14, color: colors.text, marginBottom: 4 }}>Notes</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 12, color: colors.text }}
                    value={session.notes}
                    onChangeText={val => onChange({ ...session, notes: val })}
                  />
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: colors.primary, marginBottom: 8 }}>Boulders</Text>
                  <BoulderList
                    boulders={session.boulders ?? []}
                    gradeSystem={typeof session.gradeSystem === 'string' && (session.gradeSystem === 'V' || session.gradeSystem === 'Font') ? session.gradeSystem : 'V'}
                    pickerOpenIndex={pickerOpenIndex}
                    setPickerOpenIndex={setPickerOpenIndex}
                    onChange={(boulders: Boulder[]) => onChange({ ...session, boulders })}
                  />
                  <TouchableOpacity
                    style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16, alignSelf: 'flex-start', marginBottom: 12 }}
                    onPress={() => {
                      const updated = Array.isArray(session.boulders) ? [...session.boulders] : [];
                      updated.push({ grade: (session.gradeSystem === 'V' ? V_GRADES[0] : FONT_GRADES[0]), attempts: 1, flashed: true });
                      onChange({ ...session, boulders: updated });
                    }}
                  >
                    <Text style={{ color: colors.surface, fontWeight: 'bold' }}>Add Boulder</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                    <TouchableOpacity
                      style={{ backgroundColor: colors.error, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginRight: 8 }}
                      onPress={onCancel}
                    >
                      <Text style={{ color: colors.surface, fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18 }}
                      onPress={onSave}
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
  );
};

export default SessionEditModal;
