/**
 * Scrollable SVG-based line chart for web platform.
 * Wraps chart content in horizontal ScrollView with fixed Y-axis.
 */

import React, { useRef, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { colors, borderRadius } from '../../../../shared/design/theme';
import { typography } from '../../../../shared/design/typography';
import { spacing } from '../../../../shared/design/spacing';

interface DataPoint {
  value: number;
  label?: string;
  month?: string;
  year?: number;
}

interface Props {
  data: DataPoint[];
  height: number;
  formatYLabel?: (value: number) => string;
  minValue?: number;
  maxValue?: number;
  color?: string;
  showArea?: boolean;
}

// Fixed spacing per data point
const POINT_SPACING = 50;
const MIN_CHART_WIDTH = 300;
const Y_AXIS_WIDTH = 45;

// Font settings
const FONT_FAMILY = 'System';
const AXIS_FONT_SIZE = 11;

export const ScrollableLineChart: React.FC<Props> = ({
  data,
  height,
  formatYLabel,
  minValue,
  maxValue,
  color = colors.primary,
  showArea = true,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  if (data.length === 0) return null;

  const padding = { top: 25, right: 25, bottom: 40 };
  const chartWidth = Math.max(data.length * POINT_SPACING, MIN_CHART_WIDTH);
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate value range
  const values = data.map(d => d.value);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const yMin = minValue ?? Math.max(0, dataMin - 1);
  const yMax = maxValue ?? dataMax + 1;
  const yRange = yMax - yMin || 1;

  // Generate points
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * (chartWidth - padding.right) + 10,
    y: padding.top + chartHeight - ((d.value - yMin) / yRange) * chartHeight,
    value: d.value,
    label: d.label,
    month: d.month,
    year: d.year,
    index: i,
  }));

  // Create line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Create area path
  const areaPath = showArea
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : '';

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = yMin + (yRange * i) / 4;
    const y = padding.top + chartHeight - (i / 4) * chartHeight;
    return { value, y };
  });

  // Handle point tap
  const handlePointPress = (index: number) => {
    setSelectedPoint(prev => (prev === index ? null : index));
  };

  // Get selected point info
  const selected = selectedPoint !== null ? points[selectedPoint] : null;

  return (
    <View style={styles.container}>
      {/* Fixed Y-axis */}
      <View style={[styles.yAxisContainer, { height }]}>
        <Svg width={Y_AXIS_WIDTH} height={height}>
          {yTicks.map((tick, i) => (
            <SvgText
              key={`y-label-${i}`}
              x={Y_AXIS_WIDTH - 8}
              y={tick.y + 4}
              fontSize={AXIS_FONT_SIZE}
              fontFamily={FONT_FAMILY}
              fontWeight="500"
              fill={colors.textSecondary}
              textAnchor="end"
            >
              {formatYLabel ? formatYLabel(Math.round(tick.value)) : Math.round(tick.value)}
            </SvgText>
          ))}
        </Svg>
      </View>

      {/* Scrollable chart area */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator
        style={styles.scrollView}
        contentContainerStyle={{ width: chartWidth }}
        onScrollBeginDrag={() => setSelectedPoint(null)}
      >
        <Svg width={chartWidth} height={height}>
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <Line
              key={`grid-${i}`}
              x1={0}
              y1={tick.y}
              x2={chartWidth}
              y2={tick.y}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          ))}

          {/* Area fill */}
          {showArea && <Path d={areaPath} fill={`${color}20`} />}

          {/* Line */}
          <Path d={linePath} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <Circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r={selectedPoint === i ? 7 : 5}
              fill={color}
              stroke={colors.surface}
              strokeWidth={2}
              onPress={() => handlePointPress(i)}
            />
          ))}

          {/* X-axis labels */}
          {points.map(
            (p, i) =>
              data[i].label && (
                <G key={`xlabel-${i}`}>
                  <SvgText
                    x={p.x}
                    y={height - 8}
                    fontSize={AXIS_FONT_SIZE}
                    fontFamily={FONT_FAMILY}
                    fontWeight="500"
                    fill={colors.textSecondary}
                    textAnchor="middle"
                  >
                    {data[i].label}
                  </SvgText>
                </G>
              )
          )}
        </Svg>

        {/* Touch targets for data points (web-friendly) */}
        {points.map((p, i) => (
          <Pressable
            key={`touch-${i}`}
            style={[
              styles.touchTarget,
              {
                left: p.x - 15,
                top: p.y - 15,
              },
            ]}
            onPress={() => handlePointPress(i)}
          />
        ))}
      </ScrollView>

      {/* Tooltip */}
      {selected && (
        <View style={[styles.tooltip, { top: Math.max(selected.y - 50, 5) }]}>
          <Text style={styles.tooltipMonth}>
            {selected.month} {selected.year}
          </Text>
          <Text style={styles.tooltipValue}>{formatYLabel ? formatYLabel(selected.value) : selected.value}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  tooltip: {
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: 'absolute',
    right: spacing.md,
    zIndex: 10,
  },
  tooltipMonth: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  tooltipValue: {
    ...typography.captionBold,
    color: colors.surface,
  },
  touchTarget: {
    height: 30,
    position: 'absolute',
    width: 30,
  },
  yAxisContainer: {
    width: Y_AXIS_WIDTH,
  },
});

export default ScrollableLineChart;
