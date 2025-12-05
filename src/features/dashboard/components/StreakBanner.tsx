/**
 * Motivational streak banner showing current climbing streak.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, accent } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';

interface Props {
  currentStreak: number;
}

/**
 * Get streak message based on streak length (weeks)
 */
function getStreakMessage(weeks: number): string {
  if (weeks === 1) return 'Keep it going!';
  if (weeks >= 8) return 'On fire! Incredible consistency!';
  if (weeks >= 4) return 'A month strong! Keep it alive!';
  return 'Nice streak! Keep climbing!';
}

/**
 * Get number of fire emojis based on streak length (weeks)
 */
function getFireCount(weeks: number): number {
  if (weeks >= 8) return 3;
  if (weeks >= 4) return 2;
  return 1;
}

export const StreakBanner: React.FC<Props> = ({ currentStreak }) => {
  // Don't render if no streak
  if (currentStreak <= 0) {
    return null;
  }

  const fireCount = getFireCount(currentStreak);
  const message = getStreakMessage(currentStreak);

  return (
    <View style={styles.banner}>
      <View style={styles.iconContainer}>
        {Array.from({ length: fireCount }).map((_, i) => (
          <Ionicons key={i} name="flame" size={24} color={accent.fire} />
        ))}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.streakText}>
          {currentStreak} week{currentStreak !== 1 ? 's' : ''} streak
        </Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    backgroundColor: `${accent.fire}15`,
    borderColor: `${accent.fire}30`,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  messageText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  streakText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  textContainer: {
    flex: 1,
    gap: spacing.xxs,
  },
});

export default StreakBanner;
