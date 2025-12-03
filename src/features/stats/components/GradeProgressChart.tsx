/**
 * Line chart showing grade progression over time.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { MonthlyGradeData } from '../utils/statsCalculations';
import { canonicalToGrade } from '../utils/statsCalculations';
import { SimpleLineChart } from './charts';

// Only import gifted-charts on native (crashes on web)
let LineChart: any = null;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  LineChart = require('react-native-gifted-charts').LineChart;
}

// Max canonical grade value (V17 = 17)
const MAX_GRADE = 17;

interface Props {
  data: MonthlyGradeData[];
}

// Calculate chart width accounting for screen padding, card padding, and Y-axis labels
const getChartWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenPadding = spacing.lg * 2; // StatsScreen contentContainer padding
  const cardPadding = spacing.md * 2; // Card internal padding
  const yAxisSpace = 50; // Space for Y-axis labels
  return screenWidth - screenPadding - cardPadding - yAxisSpace;
};

export const GradeProgressChart: React.FC<Props> = ({ data }) => {
  // Filter out months with no data and transform for chart
  const filteredData = data.filter(d => d.maxCanonical >= 0);
  const chartData = filteredData.map((d, index, arr) => ({
    value: d.maxCanonical,
    // Show month name for first, last, and every 3rd month for readability
    label: index === 0 || index === arr.length - 1 || index % 3 === 0 ? d.month : '',
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

  // Calculate Y-axis range (capped at V17)
  const values = chartData.map(d => Math.min(d.value, MAX_GRADE));
  const minVal = Math.max(0, Math.min(...values) - 1);
  const maxVal = Math.min(MAX_GRADE, Math.max(...values) + 1);

  // Get dynamic chart width
  const chartWidth = getChartWidth();

  // Web fallback using SimpleLineChart
  if (Platform.OS === 'web' || !LineChart) {
    const webChartData = filteredData.map((d, i, arr) => ({
      value: Math.min(d.maxCanonical, MAX_GRADE),
      label: i === 0 || i === arr.length - 1 ? d.month : undefined,
    }));

    return (
      <View style={styles.card}>
        <Text style={styles.title}>GRADE PROGRESSION</Text>
        <Text style={styles.subtitle}>Max grade per month (last 12 months)</Text>
        <View style={styles.chartContainer}>
          <SimpleLineChart
            data={webChartData}
            width={Math.min(chartWidth + 50, 600)}
            height={200}
            minValue={minVal}
            maxValue={maxVal}
            formatYLabel={val => canonicalToGrade(val)}
            color={colors.primary}
            showArea
          />
        </View>
      </View>
    );
  }

  // Cap chart data values for native chart
  const cappedChartData = chartData.map(d => ({
    ...d,
    value: Math.min(d.value, MAX_GRADE),
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>GRADE PROGRESSION</Text>
      <Text style={styles.subtitle}>Max grade per month (last 12 months)</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={cappedChartData}
          width={chartWidth}
          height={180}
          spacing={(chartWidth - 40) / Math.max(chartData.length - 1, 1)}
          initialSpacing={20}
          endSpacing={20}
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
          formatYLabel={(val: string) => canonicalToGrade(Number(val))}
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
    overflow: 'hidden',
    padding: spacing.md,
    ...shadows.md,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    width: '100%',
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
