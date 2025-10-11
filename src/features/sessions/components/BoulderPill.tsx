import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, gradeColors } from '../../../shared/theme';
import { getAllGradeSystems } from '../../grades/services/gradeSystemService';

import type { Boulder } from '../models/Boulder';
interface BoulderPillProps {
  grade: string;
  flash: number;
  total: number;
  originalGrade?: string;
  systemId?: string;
}

export default function BoulderPill({ grade, flash, total, systemId }: BoulderPillProps) {
  let gradeColor = gradeColors[grade] || '#888';
  if (systemId) {
    const sys = getAllGradeSystems().find(s => s.id === systemId);
    const c = sys?.grades.find(g => g.label === grade)?.color;
    if (c) gradeColor = c;
  }
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
  colorDot: {
    borderColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    marginLeft: 8,
    width: 16,
  },
  grade: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  gradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: '#222',
    borderColor: '#444',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    margin: 6,
    maxWidth: 200,
    minWidth: 140,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillContent: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  stat: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
