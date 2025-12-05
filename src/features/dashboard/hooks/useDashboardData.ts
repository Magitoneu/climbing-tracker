/**
 * Hook for computing dashboard statistics from session data.
 * Provides monthly stats, trends, personal bests, and recent sessions.
 */

import { useMemo } from 'react';
import type { Session } from '../../sessions/models/Session';
import {
  calculatePersonalBests,
  calculateMonthStats,
  calculateTrend,
  getSessionsForMonth,
  type MonthStats,
  type TrendResult,
  type PersonalBests,
} from '../../stats/utils/statsCalculations';

export interface RecentSession {
  id: string;
  date: string;
  dateDisplay: string;
  grades: string[];
  flashCount: number;
  totalCount: number;
}

export interface DashboardData {
  // Monthly stats (for MonthlyHeroCard)
  thisMonth: MonthStats;
  trends: {
    sessions: TrendResult;
    problems: TrendResult;
    flashRate: TrendResult;
  };

  // Personal bests (for PersonalBestsCard)
  personalBests: PersonalBests;

  // Recent sessions (last 3)
  recentSessions: RecentSession[];

  // Meta
  isLoading: boolean;
  hasData: boolean;
}

/**
 * Format a date string as relative display text (Today, Yesterday, or date)
 */
function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  }
  if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Extract grades from a session's attempts
 */
function getSessionGrades(session: Session): string[] {
  const attempts = session.attempts || [];
  return attempts.map(a => a.grade);
}

/**
 * Count flashed attempts in a session
 */
function countFlashes(session: Session): number {
  const attempts = session.attempts || [];
  return attempts.filter(a => a.flashed || a.attempts === 1).length;
}

/**
 * Compute dashboard statistics from session data.
 *
 * @param sessions - All user sessions from Firestore subscription
 * @param isLoading - Whether sessions are still loading
 * @returns Dashboard statistics for display
 */
export function useDashboardData(sessions: Session[], isLoading: boolean = false): DashboardData {
  return useMemo(() => {
    // Empty/loading state
    if (isLoading || sessions.length === 0) {
      return {
        thisMonth: {
          sessionCount: 0,
          totalProblems: 0,
          totalAttempts: 0,
          flashes: 0,
          flashRate: 0,
          maxGrade: '-',
          maxCanonical: -1,
        },
        trends: {
          sessions: { direction: 'neutral', percentage: 0, diff: 0 },
          problems: { direction: 'neutral', percentage: 0, diff: 0 },
          flashRate: { direction: 'neutral', percentage: 0, diff: 0 },
        },
        personalBests: {
          maxGrade: '-',
          maxCanonical: -1,
          totalSends: 0,
          totalSessions: 0,
          bestStreak: 0,
          currentStreak: 0,
        },
        recentSessions: [],
        isLoading,
        hasData: false,
      };
    }

    // Calculate monthly stats
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonthIndex = now.getMonth();

    const lastMonthDate = new Date(thisYear, thisMonthIndex - 1, 1);
    const lastYear = lastMonthDate.getFullYear();
    const lastMonthIndex = lastMonthDate.getMonth();

    const thisMonthSessions = getSessionsForMonth(sessions, thisYear, thisMonthIndex);
    const lastMonthSessions = getSessionsForMonth(sessions, lastYear, lastMonthIndex);

    const thisMonth = calculateMonthStats(thisMonthSessions);
    const lastMonth = calculateMonthStats(lastMonthSessions);

    // Calculate trends
    const trends = {
      sessions: calculateTrend(thisMonth.sessionCount, lastMonth.sessionCount),
      problems: calculateTrend(thisMonth.totalProblems, lastMonth.totalProblems),
      flashRate: calculateTrend(thisMonth.flashRate, lastMonth.flashRate),
    };

    // Calculate personal bests
    const personalBests = calculatePersonalBests(sessions, thisMonthSessions);

    // Get recent sessions (last 3, sorted by date descending)
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const recentSessions: RecentSession[] = sortedSessions.slice(0, 3).map(session => ({
      id: session.id || session.date,
      date: session.date,
      dateDisplay: formatDateDisplay(session.date),
      grades: getSessionGrades(session),
      flashCount: countFlashes(session),
      totalCount: (session.attempts || []).length,
    }));

    return {
      thisMonth,
      trends,
      personalBests,
      recentSessions,
      isLoading: false,
      hasData: true,
    };
  }, [sessions, isLoading]);
}

export default useDashboardData;
