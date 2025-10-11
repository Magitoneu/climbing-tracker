import React from 'react';
import { View, Pressable, Text, Platform, StyleSheet } from 'react-native';
import { colors, gradeColors } from '../../../shared/theme';
import { getGradeSystem } from '../services/gradeSystemService';

import type { Boulder } from '../../sessions/models/Boulder';
interface GradeSelectorProps {
  grades: string[];
  selected: string;
  onSelect: (grade: string) => void;
  systemId?: string; // for custom systems to colorize labels
}

export default function GradeSelector({ grades, selected, onSelect, systemId }: GradeSelectorProps) {
  const sys = systemId ? getGradeSystem(systemId) : undefined;
  const colorFor = (label: string) => {
    const sysColor = sys?.grades.find(g => g.label === label)?.color;
    return sysColor || gradeColors[label] || colors.primary;
  };
  return (
    <View style={styles.container}>
      {grades.map(grade => {
        const isSelected = selected === grade;
        const gradeColor = colorFor(grade);
        return (
          <Pressable
            key={grade}
            style={[
              styles.pill,
              {
                borderColor: gradeColor,
                backgroundColor: isSelected ? gradeColor : colors.surface,
              },
            ]}
            onPress={() => onSelect(grade)}
          >
            <Text
              style={[
                styles.text,
                isSelected ? styles.textBold : styles.textNormal,
                {
                  color: isSelected ? colors.surface : gradeColor,
                },
              ]}
            >
              {grade}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 8,
  },
  pill: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  text: {
    // Base text style, dynamic colors and weight applied via array syntax
  },
  textBold: {
    fontWeight: 'bold',
  },
  textNormal: {
    fontWeight: 'normal',
  },
});
