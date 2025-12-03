/**
 * Simple SVG-based donut chart that works on all platforms.
 * Used as web fallback for react-native-gifted-charts.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors } from '../../../../shared/design/theme';
import { typography } from '../../../../shared/design/typography';

interface Props {
  percentage: number; // 0-100
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
  centerLabel?: string;
}

export const SimpleDonutChart: React.FC<Props> = ({
  percentage,
  size = 110,
  strokeWidth = 15,
  primaryColor = colors.primary,
  secondaryColor = colors.border,
  centerLabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {centerLabel && (
        <View style={[styles.centerLabel, { width: size, height: size }]}>
          <Text style={styles.centerText}>{centerLabel}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  centerText: {
    ...typography.numericSmall,
    color: colors.text,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SimpleDonutChart;
