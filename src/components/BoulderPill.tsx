import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, gradeColors } from '../theme';


import type { Boulder } from '../models/Boulder';
interface BoulderPillProps {
  grade: string;
  flash: number;
  total: number;
  originalGrade?: string;
}

export default function BoulderPill({ grade, flash, total }: BoulderPillProps) {
  const gradeColor = gradeColors[grade] || '#888';
  return (
    <View style={styles.pill}>
      <View style={styles.pillContent}>
        <View style={styles.gradeRow}>
          <Text style={styles.grade}>{grade}</Text>
          <View style={[styles.colorDot, { backgroundColor: gradeColor }]} />
        </View>
        <View style={styles.statsRow}>
          <Text style={[styles.stat, { color: flash > 0 ? colors.flash : styles.stat.color }]}>{flash} Flash</Text>
          <Text style={styles.stat}>{total} Done</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#444',
    margin: 6,
    elevation: 2,
    minWidth: 140,
    maxWidth: 200,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  pillContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  grade: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16,
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    fontWeight: '600',
    color: '#ccc',
    fontSize: 13,
    marginHorizontal: 2,
  },
});
