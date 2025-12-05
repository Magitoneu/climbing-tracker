/**
 * Dashboard screen showing overview stats, streaks, and recent activity.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import { ClimbingIcon } from '../../../shared/components/icons/ClimbingIcon';
import { climbingEncouragement, climbingStatus } from '../../../shared/utils/climbingCopy';
import { subscribeToSessions } from '../../sessions/services/sessionService';
import { auth } from '../../../config/firebase';
import { useDashboardData } from '../hooks/useDashboardData';
import type { Session } from '../../sessions/models/Session';

// Reuse Stats components
import MonthlyHeroCard from '../../stats/components/MonthlyHeroCard';
import PersonalBestsCard from '../../stats/components/PersonalBestsCard';

// Dashboard-specific components
import StreakBanner from '../components/StreakBanner';
import RecentSessions from '../components/RecentSessions';

type TabParamList = {
  Dashboard: undefined;
  Log: undefined;
  Sessions: undefined;
  Stats: undefined;
  Settings: undefined;
};

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to sessions on focus
  useFocusEffect(
    useCallback(() => {
      let unsubscribe: (() => void) | null = null;

      const loadData = async () => {
        if (!auth.currentUser) {
          setIsLoading(false);
          return;
        }

        try {
          unsubscribe = subscribeToSessions(cloudSessions => {
            const mapped = cloudSessions.map(s => ({
              id: s.id,
              date: s.date,
              durationMinutes: s.durationMinutes,
              notes: s.notes,
              gradeSystem: s.gradeSystem,
              attempts: s.attempts || [],
              boulders: s.boulders,
            })) as Session[];

            setSessions(mapped);
            setIsLoading(false);
          });
        } catch {
          // Silently handle subscription errors - user will see empty state
          setIsLoading(false);
        }
      };

      loadData();

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [])
  );

  // Compute dashboard stats from sessions
  const data = useDashboardData(sessions, isLoading);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Empty state - no sessions yet
  if (!data.hasData) {
    return (
      <View style={styles.emptyContainer}>
        <ClimbingIcon name="mountain" size={64} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>{climbingStatus.noSessions}</Text>
        <Text style={styles.emptySubtitle}>{climbingStatus.noActivity}</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Log')}>
          <ClimbingIcon name="chalkBag" size={20} color={colors.textOnPrimary} />
          <Text style={styles.ctaButtonText}>Log Your First Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>{climbingEncouragement.comeback}</Text>

        {/* Streak Banner (only shows if streak > 0) */}
        <StreakBanner currentStreak={data.personalBests.currentStreak} />

        {/* This Month Stats */}
        <MonthlyHeroCard thisMonth={data.thisMonth} trends={data.trends} />

        {/* Personal Bests */}
        <PersonalBestsCard bests={data.personalBests} />

        {/* Recent Sessions */}
        <RecentSessions sessions={data.recentSessions} />

        {/* Bottom padding for FAB */}
        <View style={styles.fabSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Log')}
        accessibilityLabel="Log new session"
      >
        <ClimbingIcon name="chalkBag" size={32} color={colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  ctaButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  ctaButtonText: {
    ...typography.bodyBold,
    color: colors.textOnPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  fab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 32,
    bottom: 32,
    elevation: 4,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    width: 56,
  },
  fabSpacer: {
    height: 80,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
});

export default DashboardScreen;
