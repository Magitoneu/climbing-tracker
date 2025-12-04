/**
 * Line chart showing grade progression over time.
 * Supports horizontal scrolling for viewing all historical data.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { MonthlyGradeData } from '../utils/statsCalculations';
import { canonicalToGrade } from '../utils/statsCalculations';
import { ScrollableLineChart } from './charts';

// Only import gifted-charts on native (crashes on web)
let LineChart: any = null;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  LineChart = require('react-native-gifted-charts').LineChart;
}

// Max canonical grade value (V17 = 17)
const MAX_GRADE = 17;

// Fixed spacing per data point for scrollable chart
const SPACING_PER_MONTH = 50;

interface Props {
  data: MonthlyGradeData[];
  historyMonths?: number;
}

// Calculate chart width for scrollable view
const getScrollableWidth = (dataPointCount: number): number => {
  const minWidth = 300;
  return Math.max(dataPointCount * SPACING_PER_MONTH, minWidth);
};

// Calculate visible chart width (viewport)
const getViewportWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenPadding = spacing.lg * 2;
  const cardPadding = spacing.md * 2;
  const yAxisSpace = 50;
  return screenWidth - screenPadding - cardPadding - yAxisSpace;
};

// Generate dynamic subtitle based on history length
const getSubtitle = (months: number): string => {
  if (months <= 1) return 'Max grade this month';
  if (months <= 12) return `Max grade per month (${months} months)`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `Max grade per month (${years} year${years > 1 ? 's' : ''})`;
  return `Max grade per month (${years}+ years)`;
};

// Determine label interval based on data length
const getLabelInterval = (dataLength: number): number => {
  if (dataLength > 36) return 6; // Every 6 months for 3+ years
  if (dataLength > 24) return 4; // Every 4 months for 2-3 years
  if (dataLength > 12) return 3; // Every 3 months for 1-2 years
  return 1; // Every month for < 1 year
};

// Check if label should be shown at this index
const shouldShowLabel = (index: number, dataLength: number, monthIndex: number, interval: number): boolean => {
  // Always show first and last
  if (index === 0 || index === dataLength - 1) return true;
  // Always show January (year boundary)
  if (monthIndex === 0) return true;
  // Show at regular intervals
  return index % interval === 0;
};

// Format label with year for previous years (e.g., "Jan/24")
const formatLabel = (month: string, year: number): string => {
  const currentYear = new Date().getFullYear();
  if (year === currentYear) {
    return month;
  }
  // Show last 2 digits of year
  return `${month}/${String(year).slice(-2)}`;
};

export const GradeProgressChart: React.FC<Props> = ({ data, historyMonths }) => {
  // Filter out months with no data and reverse so newest is first (left)
  const filteredData = data.filter(d => d.maxCanonical >= 0).reverse();
  const totalMonths = historyMonths || data.length;
  const labelInterval = getLabelInterval(filteredData.length);

  // Transform data for chart with smart labels
  const chartData = filteredData.map((d, index, arr) => ({
    value: d.maxCanonical,
    label: shouldShowLabel(index, arr.length, d.monthIndex, labelInterval) ? formatLabel(d.month, d.year) : '',
    dataPointText: d.maxGrade,
    month: d.month,
    year: d.year,
    monthIndex: d.monthIndex,
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

  // Calculate widths
  const viewportWidth = getViewportWidth();
  const scrollableWidth = getScrollableWidth(chartData.length);
  const needsScroll = scrollableWidth > viewportWidth;

  // Web fallback using ScrollableLineChart
  if (Platform.OS === 'web' || !LineChart) {
    const webChartData = filteredData.map((d, i, arr) => ({
      value: Math.min(d.maxCanonical, MAX_GRADE),
      label: shouldShowLabel(i, arr.length, d.monthIndex, labelInterval) ? formatLabel(d.month, d.year) : undefined,
      month: d.month,
      year: d.year,
    }));

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>GRADE PROGRESSION</Text>
            <Text style={styles.subtitle}>{getSubtitle(totalMonths)}</Text>
          </View>
          {needsScroll && (
            <View style={styles.scrollHint}>
              <Ionicons name="arrow-back" size={12} color={colors.textSecondary} />
              <Text style={styles.scrollHintText}>History</Text>
            </View>
          )}
        </View>
        <View style={styles.chartContainer}>
          <ScrollableLineChart
            data={webChartData}
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
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>GRADE PROGRESSION</Text>
          <Text style={styles.subtitle}>{getSubtitle(totalMonths)}</Text>
        </View>
        {needsScroll && (
          <View style={styles.scrollHint}>
            <Ionicons name="arrow-back" size={12} color={colors.textSecondary} />
            <Text style={styles.scrollHintText}>History</Text>
          </View>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <LineChart
          data={cappedChartData}
          width={scrollableWidth}
          height={180}
          spacing={SPACING_PER_MONTH}
          initialSpacing={20}
          endSpacing={20}
          disableScroll
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
        />
      </ScrollView>
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
    marginTop: spacing.sm,
    overflow: 'hidden',
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
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingRight: spacing.md,
  },
  scrollHint: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
    opacity: 0.7,
  },
  scrollHintText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scrollView: {
    marginTop: spacing.sm,
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
});

export default GradeProgressChart;
