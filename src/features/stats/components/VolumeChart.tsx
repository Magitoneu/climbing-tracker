/**
 * Bar chart showing weekly climbing volume.
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, borderRadius, shadows, accent } from '../../../shared/design/theme';
import { SimpleBarChart } from './charts';

// Only import charts on native (crashes on web)
let BarChart: any = null;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  BarChart = require('react-native-gifted-charts').BarChart;
}
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { VolumeDataPoint } from '../utils/statsCalculations';

interface Props {
  data: VolumeDataPoint[];
}

export const VolumeChart: React.FC<Props> = ({ data }) => {
  // Transform data for chart - use week numbers for cleaner display
  const chartData = data.map((d, index) => ({
    value: d.problems,
    label: `W${data.length - index}`, // W8, W7, W6... (most recent is W1)
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

  // Web fallback using SimpleBarChart
  if (Platform.OS === 'web' || !BarChart) {
    const webChartData = data.map((d, index) => ({
      value: d.problems,
      label: `W${data.length - index}`,
      color: d.isCurrentWeek ? accent.send : colors.primary,
    }));

    return (
      <View style={styles.card}>
        <Text style={styles.title}>WEEKLY VOLUME</Text>
        <Text style={styles.subtitle}>Problems per week</Text>
        <View style={styles.chartContainer}>
          <SimpleBarChart data={webChartData} width={140} height={100} barColor={colors.primary} />
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
  webLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  webValue: {
    ...typography.numeric,
    color: colors.primary,
  },
  xAxisLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontSize: 9,
  },
});

export default VolumeChart;
