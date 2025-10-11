import React from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
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
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {grades.map(grade => (
        <Pressable
          key={grade}
          style={{
            borderWidth: 1,
            borderColor: colorFor(grade),
            borderRadius: 16,
            paddingVertical: 6,
            paddingHorizontal: 14,
            marginBottom: 8,
            backgroundColor: selected === grade ? colorFor(grade) : colors.surface,
          }}
          onPress={() => onSelect(grade)}
        >
          <Text
            style={{
              color: selected === grade ? colors.surface : colorFor(grade),
              fontWeight: selected === grade ? 'bold' : 'normal',
            }}
          >
            {grade}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
