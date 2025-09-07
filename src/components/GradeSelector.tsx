import React from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import { colors } from '../theme';
import { gradeColors } from '../theme';

import type { Boulder } from '../models/Boulder';
interface GradeSelectorProps {
  grades: string[];
  selected: string;
  onSelect: (grade: string) => void;
}

export default function GradeSelector({ grades, selected, onSelect }: GradeSelectorProps) {
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
            borderColor: gradeColors[grade] || colors.primary,
            borderRadius: 16,
            paddingVertical: 6,
            paddingHorizontal: 14,
            marginBottom: 8,
            backgroundColor: selected === grade ? (gradeColors[grade] || colors.primary) : colors.surface,
          }}
          onPress={() => onSelect(grade)}
        >
          <Text style={{ color: selected === grade ? colors.surface : (gradeColors[grade] || colors.primary), fontWeight: selected === grade ? 'bold' : 'normal' }}>{grade}</Text>
        </Pressable>
      ))}
    </View>
  );
}
