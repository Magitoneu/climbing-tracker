/**
 * Donut chart showing flash rate percentage.
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, borderRadius, shadows, semantic, stone } from '../../../shared/design/theme';
import { SimpleDonutChart } from './charts';

// Only import charts on native (crashes on web)
let PieChart: any = null;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PieChart = require('react-native-gifted-charts').PieChart;
}
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import StatTrendIndicator from './StatTrendIndicator';
import type { TrendResult } from '../utils/statsCalculations';

interface Props {
  flashRate: number; // 0-1
  trend?: TrendResult;
  totalProblems: number;
  flashes: number;
}

export const FlashRateRing: React.FC<Props> = ({ flashRate, trend, totalProblems, flashes }) => {
  const percentage = Math.round(flashRate * 100);
  const nonFlashPercentage = 100 - percentage;

  // Chart data
  const pieData = [
    {
      value: percentage || 0.1, // Prevent zero rendering issues
      color: semantic.flash,
      focused: true,
    },
    {
      value: nonFlashPercentage || 0.1,
      color: stone.slate,
    },
  ];

  // If no data
  if (totalProblems === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>FLASH RATE</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>-</Text>
        </View>
      </View>
    );
  }

  // Web fallback using SimpleDonutChart
  if (Platform.OS === 'web' || !PieChart) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>FLASH RATE</Text>
        <View style={styles.chartContainer}>
          <SimpleDonutChart
            percentage={percentage}
            size={110}
            strokeWidth={15}
            primaryColor={semantic.flash}
            secondaryColor={stone.slate}
            centerLabel={`${percentage}%`}
          />
        </View>
        <Text style={styles.detailText}>
          {flashes} of {totalProblems} flashed
        </Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={styles.vsLastMonth}>vs last month</Text>
            <StatTrendIndicator trend={trend} size="small" />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>FLASH RATE</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          radius={55}
          innerRadius={40}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          )}
        />
      </View>

      <Text style={styles.detailText}>
        {flashes} of {totalProblems} flashed
      </Text>

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
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    ...typography.numeric,
    color: colors.textSecondary,
  },
  percentageText: {
    ...typography.numericSmall,
    color: colors.text,
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
  vsLastMonth: {
    ...typography.label,
    color: colors.textSecondary,
  },
});

export default FlashRateRing;
