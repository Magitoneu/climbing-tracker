/**
 * Line chart showing grade progression over time.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { WeeklyGradeData } from '../utils/statsCalculations';
import { canonicalToGrade } from '../utils/statsCalculations';

interface Props {
  data: WeeklyGradeData[];
}

const CHART_WIDTH = Dimensions.get('window').width - spacing.lg * 2 - spacing.md * 2;

export const GradeProgressChart: React.FC<Props> = ({ data }) => {
  // Filter out weeks with no data and transform for chart
  const chartData = data
    .filter(d => d.maxCanonical >= 0)
    .map((d, index, arr) => ({
      value: d.maxCanonical,
      label: index === 0 || index === arr.length - 1 ? d.week : '',
      dataPointText: d.maxGrade,
    }));

  // If no data, show placeholder
  if (chartData.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>GRADE PROGRESSION</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Not enough data yet</Text>
          <Text style={styles.emptySubtext}>Keep climbing to see your progress!</Text>
        </View>
      </View>
    );
  }

  // Calculate Y-axis range
  const values = chartData.map(d => d.value);
  const minVal = Math.max(0, Math.min(...values) - 1);
  const maxVal = Math.min(18, Math.max(...values) + 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>GRADE PROGRESSION</Text>
      <Text style={styles.subtitle}>Max grade per week (last 12 weeks)</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={CHART_WIDTH}
          height={180}
          spacing={CHART_WIDTH / Math.max(chartData.length - 1, 1)}
          initialSpacing={0}
          endSpacing={0}
          color={colors.primary}
          thickness={3}
          hideDataPoints={false}
          dataPointsColor={colors.primary}
          dataPointsRadius={5}
          startFillColor={`${colors.primary}40`}
          endFillColor={`${colors.primary}05`}
          startOpacity={0.4}
          endOpacity={0.05}
          areaChart
          curved
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          yAxisColor={colors.border}
          xAxisColor={colors.border}
          rulesColor={colors.border}
          rulesType="dashed"
          maxValue={maxVal}
          noOfSections={Math.min(maxVal - minVal, 5)}
          yAxisOffset={minVal}
          formatYLabel={val => canonicalToGrade(Number(val))}
          hideRules={false}
          showVerticalLines={false}
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: colors.border,
            pointerStripWidth: 2,
            pointerColor: colors.primary,
            radius: 6,
            pointerLabelWidth: 80,
            pointerLabelHeight: 30,
            pointerLabelComponent: (items: any) => {
              return (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{items[0]?.dataPointText || canonicalToGrade(items[0]?.value)}</Text>
                </View>
              );
            },
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  axisText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
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
  tooltip: {
    backgroundColor: colors.text,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tooltipText: {
    ...typography.captionBold,
    color: colors.surface,
  },
});

export default GradeProgressChart;
