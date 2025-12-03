/**
 * Simple card showing monthly volume with trend indicator.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import StatTrendIndicator from './StatTrendIndicator';
import type { TrendResult } from '../utils/statsCalculations';

interface Props {
  totalProblems: number;
  trend?: TrendResult;
}

export const VolumeCard: React.FC<Props> = ({ totalProblems, trend }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>MONTHLY VOLUME</Text>

      <View style={styles.content}>
        <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} style={styles.icon} />
        <Text style={styles.value}>{totalProblems}</Text>
        <Text style={styles.label}>problems this month</Text>
      </View>

      {trend && (
        <View style={styles.trendContainer}>
          <Text style={styles.vsLastMonth}>vs last month</Text>
          <StatTrendIndicator trend={trend} size="small" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    flex: 1,
    padding: spacing.md,
    ...shadows.md,
  },
  content: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  icon: {
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  title: {
    ...typography.overline,
    color: colors.textSecondary,
  },
  trendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  value: {
    ...typography.numeric,
    color: colors.text,
  },
  vsLastMonth: {
    ...typography.label,
    color: colors.textSecondary,
  },
});

export default VolumeCard;
