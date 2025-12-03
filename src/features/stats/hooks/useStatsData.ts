/**
 * Hook for processing session data into statistics for the StatsScreen.
 */

import { useMemo } from 'react';
import type { Session } from '../../sessions/models/Session';
import {
  getSessionsForMonth,
  calculateMonthStats,
  calculateMonthlyGrades,
  calculateGradeDistribution,
  calculatePersonalBests,
  calculateTrend,
  type MonthStats,
  type MonthlyGradeData,
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
  monthlyGrades: MonthlyGradeData[];
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

    // Calculate monthly stats
    const thisMonthStats = calculateMonthStats(thisMonthSessions);
    const lastMonthStats = calculateMonthStats(lastMonthSessions);

    // Calculate trends
    const sessionsTrend = calculateTrend(thisMonthStats.sessionCount, lastMonthStats.sessionCount);
    const problemsTrend = calculateTrend(thisMonthStats.totalProblems, lastMonthStats.totalProblems);
    const flashRateTrend = calculateTrend(thisMonthStats.flashRate, lastMonthStats.flashRate);

    // Calculate chart data (monthly for grade progression)
    const monthlyGrades = calculateMonthlyGrades(sessions, 12);
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
      monthlyGrades,
      gradeDistribution,
      personalBests,
      hasData: sessions.length > 0,
      isLoading,
    };
  }, [sessions, isLoading]);
}

export default useStatsData;
