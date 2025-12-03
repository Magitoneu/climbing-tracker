import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, borderRadius } from '../../../../shared/design/theme';
import { typography } from '../../../../shared/design/typography';
import { spacing } from '../../../../shared/design/spacing';
import type { SessionStats } from '../../utils/sessionStats';

interface Props {
  stats: SessionStats;
}

const formatPct = (v: number) => (v * 100).toFixed(0) + '%';

export const StatCardCarousel: React.FC<Props> = ({ stats }) => {
  const cards = [
    { label: 'Problems', value: stats.problems.toString() },
    { label: 'Attempts', value: stats.volume.toString() },
    { label: 'Flashes', value: stats.flashes.toString() },
    { label: 'Flash %', value: formatPct(stats.flashRate) },
    { label: 'Max', value: stats.maxGrade || '-' },
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {cards.map(c => (
        <View key={c.label} style={styles.card}>
          <Text style={styles.value}>{c.value}</Text>
          <Text style={styles.label}>{c.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    minWidth: 84,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  row: {
    paddingRight: spacing.xs,
  },
  value: {
    ...typography.numericSmall,
    color: colors.primary,
  },
});

export default StatCardCarousel;
