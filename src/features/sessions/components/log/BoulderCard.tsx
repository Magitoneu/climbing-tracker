import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, shadows } from '../../../../shared/design/theme';
import { typography } from '../../../../shared/design/typography';
import { spacing } from '../../../../shared/design/spacing';
import { Attempt } from '../../models/Session';
import BoulderPill from '../../components/BoulderPill';

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
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    ...shadows.sm,
  },
  delete: {
    ...typography.captionBold,
    color: colors.error,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BoulderCard;
