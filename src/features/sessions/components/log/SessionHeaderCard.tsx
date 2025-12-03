import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, shadows } from '../../../../shared/design/theme';
import { typography } from '../../../../shared/design/typography';
import { spacing } from '../../../../shared/design/spacing';

interface Props {
  date: string;
  onPressDate: () => void;
  notes?: string;
  children?: React.ReactNode; // slot for stat cards carousel
}

export const SessionHeaderCard: React.FC<Props> = ({ date, onPressDate, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onPressDate} style={styles.datePill}>
          <Text style={styles.dateText}>{date}</Text>
        </TouchableOpacity>
      </View>
      {children && <View style={styles.statsContainer}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    ...shadows.md,
  },
  datePill: {
    backgroundColor: `${colors.primary}20`,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  dateText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsContainer: {
    marginTop: spacing.sm,
  },
});

export default SessionHeaderCard;
