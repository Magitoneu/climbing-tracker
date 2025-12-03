/**
 * Hook for processing session data into statistics for the StatsScreen.
 */

import { useMemo } from 'react';
import type { Session } from '../../sessions/models/Session';
import {
  getSessionsForMonth,
  getSessionsForWeeks,
  calculateMonthStats,
  calculateWeeklyGrades,
  calculateWeeklyVolume,
  calculateGradeDistribution,
  calculatePersonalBests,
  calculateTrend,
  type MonthStats,
  type WeeklyGradeData,
  type VolumeDataPoint,
  type GradeDistribution,
  type PersonalBests,
  type TrendResult,
} from '../utils/statsCalculations';

export interface StatsData {
  // Monthly comparison
  thisMonth: MonthStats;
  lastMonth: MonthStats;
  trends: {
    sessions: TrendResult;
    problems: TrendResult;
    flashRate: TrendResult;
  };

  // Chart data
  weeklyGrades: WeeklyGradeData[];
  weeklyVolume: VolumeDataPoint[];
  gradeDistribution: GradeDistribution[];

  // Personal bests
  personalBests: PersonalBests;

  // Meta
  hasData: boolean;
  isLoading: boolean;
}

/**
 * Process session data into statistics for display.
 *
 * @param sessions - All user sessions from Firestore subscription
 * @param isLoading - Whether sessions are still loading
 * @returns Computed statistics for the StatsScreen
 */
export function useStatsData(sessions: Session[], isLoading: boolean = false): StatsData {
  return useMemo(() => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();

    // Get last month (handle year boundary)
    const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
    const lastYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth();

    // Filter sessions by month
    const thisMonthSessions = getSessionsForMonth(sessions, thisYear, thisMonth);
    const lastMonthSessions = getSessionsForMonth(sessions, lastYear, lastMonth);

    // Get sessions for weekly charts (last 12 weeks for grades, 8 for volume)
    const recentSessions = getSessionsForWeeks(sessions, 12);

    // Calculate monthly stats
    const thisMonthStats = calculateMonthStats(thisMonthSessions);
    const lastMonthStats = calculateMonthStats(lastMonthSessions);

    // Calculate trends
    const sessionsTrend = calculateTrend(thisMonthStats.sessionCount, lastMonthStats.sessionCount);
    const problemsTrend = calculateTrend(thisMonthStats.totalProblems, lastMonthStats.totalProblems);
    const flashRateTrend = calculateTrend(thisMonthStats.flashRate, lastMonthStats.flashRate);

    // Calculate chart data
    const weeklyGrades = calculateWeeklyGrades(recentSessions, 12);
    const weeklyVolume = calculateWeeklyVolume(recentSessions, 8);
    const gradeDistribution = calculateGradeDistribution(thisMonthSessions);

    // Calculate personal bests
    const personalBests = calculatePersonalBests(sessions, thisMonthSessions);

    return {
      thisMonth: thisMonthStats,
      lastMonth: lastMonthStats,
      trends: {
        sessions: sessionsTrend,
        problems: problemsTrend,
        flashRate: flashRateTrend,
      },
      weeklyGrades,
      weeklyVolume,
      gradeDistribution,
      personalBests,
      hasData: sessions.length > 0,
      isLoading,
    };
  }, [sessions, isLoading]);
}

export default useStatsData;
