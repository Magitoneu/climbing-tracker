import type { Boulder } from '../models/Boulder';
interface BoulderRowProps {
  attempt: Attempt;
  onRemove: () => void;
}

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Attempt } from '../models/Session';
import { colors } from '../../../shared/theme';
import { useGradeDisplaySystem, formatAttempt } from '../../grades/hooks/useGradeDisplaySystem';

export default function BoulderRow({ attempt, onRemove }: BoulderRowProps) {
  const { systemId } = useGradeDisplaySystem();
  const formatted = formatAttempt(attempt as any, systemId);
  const original = (attempt as any).gradeSnapshot?.originalLabel || attempt.grade;
  const showDual = original && original !== formatted.label;
  return (
    <View style={styles.row}>
      <Text style={styles.grade}>
        {formatted.approximate ? '~' : ''}
        {formatted.label}
        {showDual ? ` (${original})` : ''}
      </Text>
      <Text style={styles.grade}>Attempts: {attempt.attempts}</Text>
      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.remove}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  grade: {
    color: colors.primary,
    fontWeight: '700',
    marginRight: 12,
  },
  remove: {
    color: 'red',
    marginLeft: 8,
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 6,
    padding: 8,
  },
});
