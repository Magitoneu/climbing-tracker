import type { Boulder } from '../models/Boulder';
interface BoulderRowProps {
  attempt: Attempt;
  onRemove: () => void;
}

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Attempt } from '../models/Session';
import { colors, borderRadius } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
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
    ...typography.bodyBold,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  remove: {
    ...typography.captionBold,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: spacing.xs,
    padding: spacing.sm,
  },
});
