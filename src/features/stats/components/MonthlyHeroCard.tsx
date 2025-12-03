/**
 * Hero card showing monthly comparison stats with trend indicators.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import StatTrendIndicator from './StatTrendIndicator';
import type { MonthStats, TrendResult } from '../utils/statsCalculations';
import { formatFlashRate } from '../utils/statsCalculations';

interface Props {
  thisMonth: MonthStats;
  trends: {
    sessions: TrendResult;
    problems: TrendResult;
    flashRate: TrendResult;
  };
}

export const MonthlyHeroCard: React.FC<Props> = ({ thisMonth, trends }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>This Month</Text>

      <View style={styles.statsRow}>
        {/* Sessions */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{thisMonth.sessionCount}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
          <StatTrendIndicator trend={trends.sessions} size="small" />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Problems Sent */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{thisMonth.totalProblems}</Text>
          <Text style={styles.statLabel}>Sends</Text>
          <StatTrendIndicator trend={trends.problems} size="small" />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Flash Rate */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatFlashRate(thisMonth.flashRate)}</Text>
          <Text style={styles.statLabel}>Flash Rate</Text>
          <StatTrendIndicator trend={trends.flashRate} size="small" />
        </View>
      </View>

      {/* Max Grade */}
      {thisMonth.maxGrade !== '-' && (
        <View style={styles.maxGradeRow}>
          <Text style={styles.maxGradeLabel}>Hardest Send</Text>
          <Text style={styles.maxGradeValue}>{thisMonth.maxGrade}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  divider: {
    backgroundColor: colors.border,
    height: 40,
    width: 1,
  },
  maxGradeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  maxGradeRow: {
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  maxGradeValue: {
    ...typography.grade,
    color: colors.primary,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xxs,
  },
  statLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.numeric,
    color: colors.text,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  title: {
    ...typography.overline,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default MonthlyHeroCard;
