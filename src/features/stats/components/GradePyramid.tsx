/**
 * Horizontal bar chart showing grade distribution.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors, borderRadius, shadows, semantic } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { GradeDistribution } from '../utils/statsCalculations';

interface Props {
  data: GradeDistribution[];
}

const CHART_WIDTH = Dimensions.get('window').width - spacing.lg * 2 - spacing.md * 2;

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

  // Create stacked bar data for each grade
  // Each bar shows flashed (gold) + non-flashed (primary)
  const chartData = data.map(d => ({
    value: d.total,
    label: d.grade,
    frontColor: colors.primary,
    // Stacked portion for flashes
    stacks: [
      {
        value: d.flashed,
        color: semantic.flash,
      },
      {
        value: d.total - d.flashed,
        color: colors.primary,
      },
    ],
  }));

  const maxValue = Math.max(...data.map(d => d.total), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>GRADE DISTRIBUTION</Text>
      <Text style={styles.subtitle}>This month&apos;s sends by grade</Text>

      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={CHART_WIDTH - 60}
          height={Math.max(data.length * 32, 120)}
          horizontal
          barWidth={20}
          spacing={8}
          initialSpacing={4}
          noOfSections={4}
          maxValue={maxValue + 1}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={colors.border}
          hideRules
          showYAxisIndices={false}
          yAxisLabelWidth={40}
          yAxisTextStyle={styles.gradeLabel}
          xAxisLabelTextStyle={styles.axisLabel}
          barBorderRadius={4}
          isAnimated
          animationDuration={500}
          renderTooltip={(item: any) => (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{item.value} sends</Text>
            </View>
          )}
        />
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  axisLabel: {
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
    paddingVertical: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  gradeLabel: {
    ...typography.grade,
    color: colors.text,
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.md,
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

export default GradePyramid;
