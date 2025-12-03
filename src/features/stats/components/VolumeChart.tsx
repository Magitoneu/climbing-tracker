/**
 * Bar chart showing weekly climbing volume.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors, borderRadius, shadows, accent } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { VolumeDataPoint } from '../utils/statsCalculations';

interface Props {
  data: VolumeDataPoint[];
}

export const VolumeChart: React.FC<Props> = ({ data }) => {
  // Transform data for chart
  const chartData = data.map(d => ({
    value: d.problems,
    label: d.week.split(' ')[1] || d.week, // Just the day number for space
    frontColor: d.isCurrentWeek ? accent.send : colors.primary,
    topLabelComponent: () => (d.problems > 0 ? <Text style={styles.barLabel}>{d.problems}</Text> : null),
  }));

  // Check if we have any data
  const hasData = data.some(d => d.problems > 0);

  if (!hasData) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>WEEKLY VOLUME</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>-</Text>
        </View>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(d => d.problems), 5);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>WEEKLY VOLUME</Text>
      <Text style={styles.subtitle}>Problems per week</Text>

      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={120}
          height={100}
          barWidth={12}
          spacing={8}
          initialSpacing={4}
          endSpacing={4}
          noOfSections={3}
          maxValue={maxValue}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={colors.border}
          hideRules
          hideYAxisText
          barBorderRadius={4}
          xAxisLabelTextStyle={styles.xAxisLabel}
          isAnimated
          animationDuration={500}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    flex: 1,
    padding: spacing.md,
    ...shadows.md,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
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
  subtitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  title: {
    ...typography.overline,
    color: colors.textSecondary,
  },
  xAxisLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontSize: 9,
  },
});

export default VolumeChart;
