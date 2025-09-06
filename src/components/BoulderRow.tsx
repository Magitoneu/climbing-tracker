
interface BoulderRowProps {
  attempt: Attempt;
  onRemove: () => void;
}

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Attempt } from '../models/Session';
import { colors } from '../theme';

export default function BoulderRow({ attempt, onRemove }: BoulderRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.grade}>{attempt.grade}</Text>
      <Text style={styles.grade}>Attempts: {attempt.attempts}</Text>
      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.remove}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  grade: {
    marginRight: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  remove: {
    color: 'red',
    marginLeft: 8,
  },
});
