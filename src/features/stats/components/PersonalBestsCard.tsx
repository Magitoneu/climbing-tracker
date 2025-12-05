/**
 * Card showing personal best achievements.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, shadows, semantic, accent } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { PersonalBests } from '../utils/statsCalculations';

interface Props {
  bests: PersonalBests;
}

export const PersonalBestsCard: React.FC<Props> = ({ bests }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>PERSONAL BESTS</Text>

      <View style={styles.grid}>
        {/* Max Grade */}
        <View style={styles.statBox}>
          <MaterialCommunityIcons name="trophy" size={24} color={semantic.flash} />
          <Text style={styles.statValue}>{bests.maxGrade}</Text>
          <Text style={styles.statLabel}>All-Time Max</Text>
        </View>

        {/* Total Sends */}
        <View style={styles.statBox}>
          <MaterialCommunityIcons name="counter" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{bests.totalSends}</Text>
          <Text style={styles.statLabel}>Total Sends</Text>
        </View>

        {/* Best Streak (weeks) */}
        <View style={styles.statBox}>
          <Ionicons name="flame" size={24} color={accent.fire} />
          <Text style={styles.statValue}>{bests.bestStreak}w</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>

        {/* Current Streak (weeks) or Total Sessions */}
        <View style={styles.statBox}>
          {bests.currentStreak > 0 ? (
            <>
              <Ionicons name="flash" size={24} color={colors.success} />
              <Text style={styles.statValue}>{bests.currentStreak}w</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="calendar-check" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{bests.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </>
          )}
        </View>
      </View>

      {/* Month PR highlight */}
      {bests.monthPR && bests.monthPRCanonical !== undefined && bests.monthPRCanonical === bests.maxCanonical && (
        <View style={styles.prBanner}>
          <Ionicons name="star" size={16} color={semantic.flash} />
          <Text style={styles.prText}>New PR this month: {bests.monthPR}!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  prBanner: {
    alignItems: 'center',
    backgroundColor: `${semantic.flash}20`,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  prText: {
    ...typography.captionBold,
    color: colors.text,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    flex: 1,
    gap: spacing.xs,
    minWidth: '45%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  statLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statValue: {
    ...typography.numericSmall,
    color: colors.text,
  },
  title: {
    ...typography.overline,
    color: colors.textSecondary,
  },
});

export default PersonalBestsCard;
