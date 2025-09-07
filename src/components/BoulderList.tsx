import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { Boulder } from '../models/Boulder';
import { V_GRADES, FONT_GRADES } from '../models/grades';
import { colors } from '../theme';

interface BoulderListProps {
  boulders: Boulder[];
  gradeSystem: 'V' | 'Font';
  pickerOpenIndex: number | null;
  setPickerOpenIndex: (i: number | null) => void;
  onChange: (boulders: Boulder[]) => void;
}

const BoulderList: React.FC<BoulderListProps> = ({
  boulders,
  gradeSystem,
  pickerOpenIndex,
  setPickerOpenIndex,
  onChange,
}) => {
  return (
    <>
      {boulders.length > 0 ? (
        boulders.map((b: Boulder, i: number) => (
          <View key={i} style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: colors.primary, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 13, color: colors.text, fontWeight: 'bold' }}>Boulder {i + 1}</Text>
              {b.flashed && (
                <Ionicons name="flash" size={18} color={colors.flash || colors.primary} style={{ marginLeft: 6 }} />
              )}
            </View>
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
                    const updated = [...boulders];
                    updated[i].grade = val as string;
                    onChange(updated);
                    setPickerOpenIndex(null);
                  }}
                  style={{ color: colors.text }}
                >
                  {(gradeSystem === 'V' ? V_GRADES : FONT_GRADES).map(g => (
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
                const updated = [...boulders];
                const attempts = val.replace(/[^0-9]/g, '');
                updated[i].attempts = Number(attempts);
                updated[i].flashed = attempts === '1';
                onChange(updated);
              }}
            />
            <TouchableOpacity
              style={{ backgroundColor: colors.error, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16, alignSelf: 'flex-end' }}
              onPress={() => {
                const updated = [...boulders];
                updated.splice(i, 1);
                onChange(updated);
              }}
            >
              <Text style={{ color: colors.surface }}>Remove Boulder</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={{ color: colors.text, opacity: 0.7 }}>No boulders logged.</Text>
      )}
    </>
  );
};

export default BoulderList;
