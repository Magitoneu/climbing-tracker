/**
 * Statistics screen showing climbing progress and achievements.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { subscribeToSessions } from '../../sessions/services/sessionService';
import { auth } from '../../../config/firebase';
import { useStatsData } from '../hooks/useStatsData';
import type { Session } from '../../sessions/models/Session';

// Components
import MonthlyHeroCard from '../components/MonthlyHeroCard';
import GradeProgressChart from '../components/GradeProgressChart';
import FlashRateRing from '../components/FlashRateRing';
import VolumeChart from '../components/VolumeChart';
import GradePyramid from '../components/GradePyramid';
import PersonalBestsCard from '../components/PersonalBestsCard';

import { styles } from './StatsScreen.styles';

export default function StatsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<any>();

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
            // Map to Session type
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
        } catch (error) {
          console.warn('[StatsScreen] Failed to subscribe to sessions:', error);
          setIsLoading(false);
        }
      };

      loadData();

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [])
  );

  // Process session data into stats
  const stats = useStatsData(sessions, isLoading);

  // Get current month name
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
        <Text style={styles.loadingText}>Loading your stats...</Text>
      </View>
    );
  }

  // Empty state
  if (!stats.hasData) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="analytics-outline" size={64} color={styles.emptyIcon.color} />
        <Text style={styles.emptyTitle}>No sends logged yet</Text>
        <Text style={styles.emptySubtitle}>Log your first session to start tracking progress</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Log')}>
          <Text style={styles.ctaButtonText}>Log a Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.monthLabel}>{monthName}</Text>
      </View>

      {/* Monthly Comparison Hero Card */}
      <MonthlyHeroCard thisMonth={stats.thisMonth} trends={stats.trends} />

      {/* Grade Progression Chart */}
      <View style={styles.section}>
        <GradeProgressChart data={stats.weeklyGrades} />
      </View>

      {/* Flash Rate + Volume (side by side) */}
      <View style={styles.rowSection}>
        <FlashRateRing
          flashRate={stats.thisMonth.flashRate}
          trend={stats.trends.flashRate}
          totalProblems={stats.thisMonth.totalProblems}
          flashes={stats.thisMonth.flashes}
        />
        <VolumeChart data={stats.weeklyVolume} />
      </View>

      {/* Grade Distribution Pyramid */}
      <View style={styles.section}>
        <GradePyramid data={stats.gradeDistribution} />
      </View>

      {/* Personal Bests */}
      <View style={styles.section}>
        <PersonalBestsCard bests={stats.personalBests} />
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}
