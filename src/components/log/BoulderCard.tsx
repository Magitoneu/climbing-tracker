import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Attempt } from '../../models/Session';
import BoulderPill from '../BoulderPill';

interface Props {
  attempt: Attempt;
  index: number;
  systemId: string;
  onDelete: (index: number) => void;
}

export const BoulderCard: React.FC<Props> = ({ attempt, index, onDelete, systemId }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}> 
        <BoulderPill
          grade={attempt.grade}
          flash={attempt.flashed ? 1 : 0}
          total={attempt.attempts ?? 1}
          originalGrade={attempt.grade}
          systemId={systemId}
        />
        <TouchableOpacity onPress={() => onDelete(index)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  delete: { color: '#DC2626', fontSize: 13, fontWeight: '600' }
});

export default BoulderCard;
