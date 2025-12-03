/**
 * Simple SVG-based line chart that works on all platforms.
 * Used as web fallback for react-native-gifted-charts.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../../../../shared/design/theme';
import { typography } from '../../../../shared/design/typography';
import { spacing } from '../../../../shared/design/spacing';

interface DataPoint {
  value: number;
  label?: string;
}

interface Props {
  data: DataPoint[];
  width: number;
  height: number;
  formatYLabel?: (value: number) => string;
  minValue?: number;
  maxValue?: number;
  color?: string;
  showArea?: boolean;
}

// Font settings to match design system
const FONT_FAMILY = 'System'; // Use system font for cross-platform consistency
const AXIS_FONT_SIZE = 12;

export const SimpleLineChart: React.FC<Props> = ({
  data,
  width,
  height,
  formatYLabel,
  minValue,
  maxValue,
  color = colors.primary,
  showArea = true,
}) => {
  if (data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 35, left: 50 };
  const chartWidth = width - padding.left - padding.right;
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
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - yMin) / yRange) * chartHeight,
    value: d.value,
    label: d.label,
  }));

  // Create line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Create area path
  const areaPath = showArea
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`
    : '';

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = yMin + (yRange * i) / 4;
    const y = padding.top + chartHeight - (i / 4) * chartHeight;
    return { value, y };
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <Line
            key={i}
            x1={padding.left}
            y1={tick.y}
            x2={width - padding.right}
            y2={tick.y}
            stroke={colors.border}
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <SvgText
            key={`label-${i}`}
            x={padding.left - 10}
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

        {/* Area fill */}
        {showArea && <Path d={areaPath} fill={`${color}20`} />}

        {/* Line */}
        <Path d={linePath} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={5} fill={color} stroke={colors.surface} strokeWidth={2} />
        ))}

        {/* X-axis labels (first and last) */}
        {points.length > 0 && data[0].label && (
          <SvgText
            x={points[0].x}
            y={height - 10}
            fontSize={AXIS_FONT_SIZE}
            fontFamily={FONT_FAMILY}
            fontWeight="500"
            fill={colors.textSecondary}
            textAnchor="start"
          >
            {data[0].label}
          </SvgText>
        )}
        {points.length > 1 && data[data.length - 1].label && (
          <SvgText
            x={points[points.length - 1].x}
            y={height - 10}
            fontSize={AXIS_FONT_SIZE}
            fontFamily={FONT_FAMILY}
            fontWeight="500"
            fill={colors.textSecondary}
            textAnchor="end"
          >
            {data[data.length - 1].label}
          </SvgText>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default SimpleLineChart;
