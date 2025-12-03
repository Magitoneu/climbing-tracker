import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import { getAllGradeSystems } from '../../grades/services/gradeSystemService';

interface BoulderPillProps {
  grade: string;
  flash: number;
  total: number;
  originalGrade?: string;
  systemId?: string;
}

export default function BoulderPill({ grade, flash, total, systemId }: BoulderPillProps) {
  // Get grade color from system or fall back to primary
  let gradeColor: string = colors.primary;
  if (systemId) {
    const sys = getAllGradeSystems().find(s => s.id === systemId);
    const c = sys?.grades.find(g => g.label === grade)?.color;
    if (c) gradeColor = c;
  }
  return (
    <View style={styles.pill}>
      <View style={styles.pillContent}>
        <View style={styles.gradeRow}>
          <Text style={styles.grade}>{grade}</Text>
          <View style={[styles.colorDot, { backgroundColor: gradeColor }]} />
        </View>
        <View style={styles.statsRow}>
          <Text style={[styles.stat, flash > 0 && styles.statFlash]}>{flash} Flash</Text>
          <Text style={styles.stat}>{total} Done</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  colorDot: {
    borderColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 2,
    height: 16,
    marginLeft: spacing.sm,
    width: 16,
  },
  grade: {
    ...typography.grade,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  gradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xxs,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    margin: spacing.xs,
    maxWidth: 200,
    minWidth: 140,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  pillContent: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  stat: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.xxs,
  },
  statFlash: {
    color: colors.flash,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
