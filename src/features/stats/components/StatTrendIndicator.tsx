/**
 * Reusable trend indicator showing up/down/neutral direction with percentage.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { TrendResult } from '../utils/statsCalculations';

interface Props {
  trend: TrendResult;
  showPercentage?: boolean;
  size?: 'small' | 'medium';
}

export const StatTrendIndicator: React.FC<Props> = ({ trend, showPercentage = true, size = 'medium' }) => {
  const { direction, percentage } = trend;

  const iconSize = size === 'small' ? 14 : 18;
  const textStyle = size === 'small' ? styles.textSmall : styles.textMedium;

  if (direction === 'neutral') {
    return (
      <View style={styles.container}>
        <Ionicons name="remove" size={iconSize} color={colors.textSecondary} />
        {showPercentage && <Text style={[textStyle, styles.neutral]}>0%</Text>}
      </View>
    );
  }

  const isUp = direction === 'up';
  const iconName = isUp ? 'arrow-up' : 'arrow-down';
  const color = isUp ? colors.success : colors.error;

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={iconSize} color={color} />
      {showPercentage && <Text style={[textStyle, { color }]}>{percentage}%</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  neutral: {
    color: colors.textSecondary,
  },
  textMedium: {
    ...typography.captionBold,
  },
  textSmall: {
    ...typography.label,
    fontWeight: '600',
  },
});

export default StatTrendIndicator;
