/**
 * Simple SVG-based bar chart that works on all platforms.
 * Used as web fallback for react-native-gifted-charts.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { colors } from '../../../../shared/design/theme';

interface DataPoint {
  value: number;
  label?: string;
  color?: string;
}

interface Props {
  data: DataPoint[];
  width: number;
  height: number;
  barColor?: string;
  highlightColor?: string;
  showValues?: boolean;
}

export const SimpleBarChart: React.FC<Props> = ({
  data,
  width,
  height,
  barColor = colors.primary,
  showValues = true,
}) => {
  if (data.length === 0) return null;

  const padding = { top: 25, right: 10, bottom: 25, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = Math.min(20, (chartWidth / data.length) * 0.7);
  const barSpacing = chartWidth / data.length;

  const bars = data.map((d, i) => {
    const barHeight = (d.value / maxValue) * chartHeight;
    const x = padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
    const y = padding.top + chartHeight - barHeight;

    return {
      x,
      y,
      width: barWidth,
      height: barHeight,
      value: d.value,
      label: d.label,
      color: d.color || barColor,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* X-axis line */}
        <Line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={width - padding.right}
          y2={padding.top + chartHeight}
          stroke={colors.border}
          strokeWidth={1}
        />

        {/* Bars */}
        {bars.map((bar, i) => (
          <React.Fragment key={i}>
            <Rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={Math.max(bar.height, 2)}
              fill={bar.color}
              rx={4}
              ry={4}
            />
            {/* Value label on top */}
            {showValues && bar.value > 0 && (
              <SvgText
                x={bar.x + bar.width / 2}
                y={bar.y - 6}
                fontSize={10}
                fill={colors.textSecondary}
                textAnchor="middle"
              >
                {bar.value}
              </SvgText>
            )}
            {/* X-axis label */}
            {bar.label && (
              <SvgText
                x={bar.x + bar.width / 2}
                y={height - 6}
                fontSize={9}
                fill={colors.textSecondary}
                textAnchor="middle"
              >
                {bar.label}
              </SvgText>
            )}
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default SimpleBarChart;
