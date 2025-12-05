/**
 * Recent sessions list showing the last few climbing sessions.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, borderRadius, shadows, semantic } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import type { RecentSession } from '../hooks/useDashboardData';

type TabParamList = {
  Dashboard: undefined;
  Log: undefined;
  Sessions: undefined;
  Stats: undefined;
  Settings: undefined;
};

interface Props {
  sessions: RecentSession[];
}

/**
 * Format grades as a short summary (max 4 shown)
 */
function formatGrades(grades: string[]): string {
  if (grades.length === 0) return 'No problems logged';
  if (grades.length <= 4) return grades.join(', ');
  return `${grades.slice(0, 4).join(', ')} +${grades.length - 4} more`;
}

export const RecentSessions: React.FC<Props> = ({ sessions }) => {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  if (sessions.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>RECENT SESSIONS</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sessions')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sessionList}>
        {sessions.map((session, index) => (
          <View key={session.id}>
            <View style={styles.sessionRow}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.dateText}>{session.dateDisplay}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.gradesText} numberOfLines={1}>
                  {formatGrades(session.grades)}
                </Text>
                <View style={styles.statsRow}>
                  <Text style={styles.problemCount}>
                    {session.totalCount} problem{session.totalCount !== 1 ? 's' : ''}
                  </Text>
                  {session.flashCount > 0 && (
                    <View style={styles.flashBadge}>
                      <Ionicons name="flash" size={12} color={semantic.flash} />
                      <Text style={styles.flashText}>{session.flashCount} flashed</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {index < sessions.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
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
  dateContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    minWidth: 100,
  },
  dateText: {
    ...typography.captionBold,
    color: colors.text,
  },
  detailsContainer: {
    flex: 1,
    gap: spacing.xxs,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.sm,
  },
  flashBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  flashText: {
    ...typography.label,
    color: semantic.flash,
  },
  gradesText: {
    ...typography.body,
    color: colors.text,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  problemCount: {
    ...typography.label,
    color: colors.textSecondary,
  },
  sessionList: {
    gap: 0,
  },
  sessionRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    ...typography.overline,
    color: colors.textSecondary,
  },
  viewAll: {
    ...typography.captionBold,
    color: colors.primary,
  },
});

export default RecentSessions;
