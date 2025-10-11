import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginRight: 8,
    minWidth: 84,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: { color: '#475569', fontSize: 11, fontWeight: '500', letterSpacing: 0.3, marginTop: 2 },
  row: { paddingRight: 4 },
  value: { color: '#0F172A', fontSize: 18, fontWeight: '600' },
});

export default StatCardCarousel;
