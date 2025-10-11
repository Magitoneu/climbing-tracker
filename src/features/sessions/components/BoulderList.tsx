import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { Boulder } from '../models/Boulder';
import { getGradeSystem } from '../../grades/services/gradeSystemService';
import { useGradeDisplaySystem, formatBoulder } from '../../grades/hooks/useGradeDisplaySystem';
import { colors } from '../../../shared/theme';
import { styles } from './BoulderList.styles';

interface BoulderListProps {
  boulders: Boulder[];
  gradeSystem: string; // builtin or custom id
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
  const { systemId } = useGradeDisplaySystem();
  return (
    <>
      {boulders.length > 0 ? (
        boulders.map((b: Boulder, i: number) => (
          <View key={i} style={styles.boulderCard}>
            <View style={styles.boulderHeader}>
              <Text style={styles.boulderNumber}>Boulder {i + 1}</Text>
              {b.flashed && (
                <Ionicons name="flash" size={18} color={colors.flash || colors.primary} style={styles.flashIcon} />
              )}
            </View>
            {pickerOpenIndex !== i ? (
              <View style={styles.gradeRow}>
                {(() => {
                  const converted = formatBoulder(b, systemId);
                  const original = (b as any).gradeSnapshot?.originalLabel || b.grade;
                  const showDual = original && original !== converted.label;
                  return (
                    <Text style={styles.gradeText}>
                      {converted.approximate ? '~' : ''}
                      {converted.label}
                      {showDual ? ` (${original})` : ''}
                    </Text>
                  );
                })()}
                <TouchableOpacity style={styles.changeGradeButton} onPress={() => setPickerOpenIndex(i)}>
                  <Text style={styles.changeGradeText}>Change Grade</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={b.grade}
                  onValueChange={val => {
                    const updated = [...boulders];
                    updated[i].grade = val as string;
                    onChange(updated);
                    setPickerOpenIndex(null);
                  }}
                  style={styles.picker}
                >
                  {(() => {
                    const sys = getGradeSystem(
                      gradeSystem === 'V' ? 'vscale' : gradeSystem === 'Font' ? 'font' : gradeSystem
                    );
                    const options = sys ? sys.grades.map(g => g.label) : [];
                    return options.map(g => <Picker.Item key={g} label={g} value={g} />);
                  })()}
                </Picker>
              </View>
            )}
            <Text style={styles.attemptsLabel}>Attempts</Text>
            <TextInput
              style={styles.attemptsInput}
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
              style={styles.removeButton}
              onPress={() => {
                const updated = [...boulders];
                updated.splice(i, 1);
                onChange(updated);
              }}
            >
              <Text style={styles.removeButtonText}>Remove Boulder</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No boulders logged.</Text>
      )}
    </>
  );
};

export default BoulderList;
