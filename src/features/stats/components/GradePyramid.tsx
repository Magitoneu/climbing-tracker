/**
 * Horizontal bar chart showing grade distribution.
 * Uses native Views for reliable cross-platform layout.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, shadows, semantic } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { GradeDistribution } from '../utils/statsCalculations';

interface Props {
  data: GradeDistribution[];
}

export const GradePyramid: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>GRADE DISTRIBUTION</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No sends this month</Text>
        </View>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(d => d.total), 1);
  const totalSends = data.reduce((sum, d) => sum + d.total, 0);
  const totalFlashes = data.reduce((sum, d) => sum + d.flashed, 0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>GRADE DISTRIBUTION</Text>
      <Text style={styles.subtitle}>This month&apos;s sends by grade</Text>

      <View style={styles.chartContainer}>
        {data.map(d => {
          const flashedWidth = (d.flashed / maxValue) * 100;
          const sentWidth = ((d.total - d.flashed) / maxValue) * 100;

          return (
            <View key={d.grade} style={styles.row}>
              <Text style={styles.gradeLabel}>{d.grade}</Text>
              <View style={styles.barContainer}>
                {d.flashed > 0 && <View style={[styles.barFlashed, { width: `${flashedWidth}%` }]} />}
                {d.total - d.flashed > 0 && <View style={[styles.barSent, { width: `${sentWidth}%` }]} />}
              </View>
              <Text style={styles.countLabel}>{d.total}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: semantic.flash }]} />
            <Text style={styles.legendText}>Flashed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Sent</Text>
          </View>
        </View>
        <Text style={styles.totalText}>
          {totalSends} sends • {totalFlashes} flashed
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    flex: 1,
    flexDirection: 'row',
    height: 20,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  barFlashed: {
    backgroundColor: semantic.flash,
    height: '100%',
  },
  barSent: {
    backgroundColor: colors.primary,
    height: '100%',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  chartContainer: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  countLabel: {
    ...typography.captionBold,
    color: colors.text,
    minWidth: 24,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  gradeLabel: {
    ...typography.grade,
    color: colors.text,
    fontSize: 13,
    minWidth: 36,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  legendDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  legendText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  title: {
    ...typography.overline,
    color: colors.textSecondary,
  },
  totalText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default GradePyramid;
