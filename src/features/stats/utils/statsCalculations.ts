/**
 * Statistics calculation utilities for the StatsScreen.
 * Pure functions for computing monthly stats, trends, and chart data.
 */

import type { Session, Attempt } from '../../sessions/models/Session';

// ============================================================================
// Types
// ============================================================================

export interface MonthStats {
  sessionCount: number;
  totalProblems: number;
  totalAttempts: number;
  flashes: number;
  flashRate: number; // 0-1
  maxGrade: string;
  maxCanonical: number; // 0-18
}

export interface WeeklyGradeData {
  week: string;
  weekStart: Date;
  maxCanonical: number;
  maxGrade: string;
}

export interface MonthlyGradeData {
  month: string; // Short month name (e.g., "Jan", "Feb")
  year: number;
  monthIndex: number; // 0-11
  maxCanonical: number;
  maxGrade: string;
}

export interface VolumeDataPoint {
  week: string;
  weekStart: Date;
  problems: number;
  isCurrentWeek: boolean;
}

export interface GradeDistribution {
  grade: string;
  canonicalValue: number;
  total: number;
  flashed: number;
}

export interface PersonalBests {
  maxGrade: string;
  maxCanonical: number;
  totalSends: number;
  totalSessions: number;
  bestStreak: number;
  currentStreak: number;
  monthPR?: string;
  monthPRCanonical?: number;
}

export interface TrendResult {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
  diff: number;
}

// ============================================================================
// Date Helpers
// ============================================================================

/**
 * Get the start of a week (Monday) for a given date.
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Format a date as "MMM D" (e.g., "Dec 2").
 */
function formatWeekLabel(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

/**
 * Parse an ISO date string to a Date object.
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

// ============================================================================
// Session Filtering
// ============================================================================

/**
 * Filter sessions by year and month (0-indexed month).
 */
export function getSessionsForMonth(sessions: Session[], year: number, month: number): Session[] {
  return sessions.filter(s => {
    const d = parseDate(s.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

/**
 * Filter sessions within the last N weeks from today.
 */
export function getSessionsForWeeks(sessions: Session[], weeks: number): Session[] {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - weeks * 7);
  cutoff.setHours(0, 0, 0, 0);

  return sessions.filter(s => {
    const d = parseDate(s.date);
    return d >= cutoff && d <= now;
  });
}

// ============================================================================
// Monthly Statistics
// ============================================================================

/**
 * Calculate aggregate statistics for a set of sessions.
 */
export function calculateMonthStats(sessions: Session[]): MonthStats {
  if (sessions.length === 0) {
    return {
      sessionCount: 0,
      totalProblems: 0,
      totalAttempts: 0,
      flashes: 0,
      flashRate: 0,
      maxGrade: '-',
      maxCanonical: -1,
    };
  }

  let totalProblems = 0;
  let totalAttempts = 0;
  let flashes = 0;
  let maxCanonical = -1;
  let maxGrade = '-';

  for (const session of sessions) {
    const attempts = session.attempts || [];
    for (const attempt of attempts) {
      totalProblems += 1;
      totalAttempts += attempt.attempts || 1;

      // Count flash (explicit or implicit when attempts === 1)
      if (attempt.flashed || attempt.attempts === 1) {
        flashes += 1;
      }

      // Track max grade using canonical value
      const cv = getCanonicalValue(attempt);
      if (cv > maxCanonical) {
        maxCanonical = cv;
        maxGrade = attempt.grade;
      }
    }
  }

  return {
    sessionCount: sessions.length,
    totalProblems,
    totalAttempts,
    flashes,
    flashRate: totalProblems > 0 ? flashes / totalProblems : 0,
    maxGrade,
    maxCanonical,
  };
}

// ============================================================================
// Weekly Data for Charts
// ============================================================================

/**
 * Calculate weekly max grade data for line chart.
 * @deprecated Use calculateMonthlyGrades instead for grade progression
 */
export function calculateWeeklyGrades(sessions: Session[], weeks: number = 12): WeeklyGradeData[] {
  const now = new Date();
  const result: WeeklyGradeData[] = [];

  // Generate week buckets (most recent first, then reverse)
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = getWeekStart(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
    result.push({
      week: formatWeekLabel(weekStart),
      weekStart,
      maxCanonical: -1,
      maxGrade: '',
    });
  }

  // Fill in max grades for each week
  for (const session of sessions) {
    const sessionDate = parseDate(session.date);
    const sessionWeekStart = getWeekStart(sessionDate);

    const weekData = result.find(w => w.weekStart.getTime() === sessionWeekStart.getTime());
    if (!weekData) continue;

    for (const attempt of session.attempts || []) {
      const cv = getCanonicalValue(attempt);
      if (cv > weekData.maxCanonical) {
        weekData.maxCanonical = cv;
        weekData.maxGrade = attempt.grade;
      }
    }
  }

  return result;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Calculate monthly max grade data for line chart.
 * Shows grade progression over the last N months.
 */
export function calculateMonthlyGrades(sessions: Session[], months: number = 12): MonthlyGradeData[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const result: MonthlyGradeData[] = [];

  // Generate month buckets (oldest first)
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    result.push({
      month: MONTH_NAMES[date.getMonth()],
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
      maxCanonical: -1,
      maxGrade: '',
    });
  }

  // Fill in max grades for each month
  for (const session of sessions) {
    const sessionDate = parseDate(session.date);
    const sessionYear = sessionDate.getFullYear();
    const sessionMonth = sessionDate.getMonth();

    const monthData = result.find(m => m.year === sessionYear && m.monthIndex === sessionMonth);
    if (!monthData) continue;

    for (const attempt of session.attempts || []) {
      const cv = getCanonicalValue(attempt);
      if (cv > monthData.maxCanonical) {
        monthData.maxCanonical = cv;
        monthData.maxGrade = attempt.grade;
      }
    }
  }

  return result;
}

/**
 * Calculate the date range from the earliest session to now.
 *
 * @param sessions - All user sessions
 * @returns Start date, end date, and total month count spanning the history
 */
export function calculateSessionDateRange(sessions: Session[]): {
  startDate: Date;
  endDate: Date;
  monthCount: number;
} {
  if (sessions.length === 0) {
    return { startDate: new Date(), endDate: new Date(), monthCount: 0 };
  }

  // Find earliest session date
  const dates = sessions.map(s => parseDate(s.date)).sort((a, b) => a.getTime() - b.getTime());
  const startDate = dates[0];
  const endDate = new Date();

  // Calculate months between start and end (inclusive)
  const monthCount =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

  return { startDate, endDate, monthCount };
}

/**
 * Calculate monthly grade data for ALL historical months.
 * Returns data from the first session month to the current month.
 *
 * @param sessions - All user sessions
 * @returns Monthly grade data spanning entire climbing history
 */
export function calculateAllMonthlyGrades(sessions: Session[]): MonthlyGradeData[] {
  const { monthCount } = calculateSessionDateRange(sessions);
  if (monthCount === 0) return [];

  return calculateMonthlyGrades(sessions, monthCount);
}

/**
 * Calculate weekly volume data for bar chart.
 */
export function calculateWeeklyVolume(sessions: Session[], weeks: number = 8): VolumeDataPoint[] {
  const now = new Date();
  const currentWeekStart = getWeekStart(now);
  const result: VolumeDataPoint[] = [];

  // Generate week buckets
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = getWeekStart(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
    result.push({
      week: formatWeekLabel(weekStart),
      weekStart,
      problems: 0,
      isCurrentWeek: weekStart.getTime() === currentWeekStart.getTime(),
    });
  }

  // Fill in problem counts for each week
  for (const session of sessions) {
    const sessionDate = parseDate(session.date);
    const sessionWeekStart = getWeekStart(sessionDate);

    const weekData = result.find(w => w.weekStart.getTime() === sessionWeekStart.getTime());
    if (!weekData) continue;

    weekData.problems += (session.attempts || []).length;
  }

  return result;
}

// ============================================================================
// Grade Distribution
// ============================================================================

/**
 * Calculate grade distribution for pyramid chart.
 */
export function calculateGradeDistribution(sessions: Session[]): GradeDistribution[] {
  const gradeMap = new Map<string, { total: number; flashed: number; canonical: number }>();

  for (const session of sessions) {
    for (const attempt of session.attempts || []) {
      const grade = attempt.grade;
      const cv = getCanonicalValue(attempt);
      const isFlash = attempt.flashed || attempt.attempts === 1;

      if (!gradeMap.has(grade)) {
        gradeMap.set(grade, { total: 0, flashed: 0, canonical: cv });
      }

      const entry = gradeMap.get(grade)!;
      entry.total += 1;
      if (isFlash) entry.flashed += 1;
    }
  }

  // Convert to array and sort by canonical value
  const result: GradeDistribution[] = [];
  for (const [grade, data] of gradeMap) {
    result.push({
      grade,
      canonicalValue: data.canonical,
      total: data.total,
      flashed: data.flashed,
    });
  }

  // Sort by canonical value (ascending = easier grades first)
  result.sort((a, b) => a.canonicalValue - b.canonicalValue);

  return result;
}

// ============================================================================
// Personal Bests
// ============================================================================

/**
 * Calculate personal best achievements across all sessions.
 */
export function calculatePersonalBests(allSessions: Session[], currentMonthSessions?: Session[]): PersonalBests {
  let maxCanonical = -1;
  let maxGrade = '-';
  let totalSends = 0;

  // Process all sessions for all-time stats
  for (const session of allSessions) {
    for (const attempt of session.attempts || []) {
      totalSends += 1;
      const cv = getCanonicalValue(attempt);
      if (cv > maxCanonical) {
        maxCanonical = cv;
        maxGrade = attempt.grade;
      }
    }
  }

  // Calculate streak
  const { current: currentStreak, best: bestStreak } = calculateStreak(allSessions);

  // Calculate month PR if we have current month data
  let monthPR: string | undefined;
  let monthPRCanonical: number | undefined;

  if (currentMonthSessions && currentMonthSessions.length > 0) {
    let monthMax = -1;
    for (const session of currentMonthSessions) {
      for (const attempt of session.attempts || []) {
        const cv = getCanonicalValue(attempt);
        if (cv > monthMax) {
          monthMax = cv;
          monthPR = attempt.grade;
          monthPRCanonical = cv;
        }
      }
    }
  }

  return {
    maxGrade,
    maxCanonical,
    totalSends,
    totalSessions: allSessions.length,
    bestStreak,
    currentStreak,
    monthPR,
    monthPRCanonical,
  };
}

/**
 * Get the ISO week number for a date.
 * Week starts on Monday.
 */
function getWeekNumber(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNo };
}

/**
 * Calculate climbing streak (consecutive weeks with at least one session).
 * A week runs Monday to Sunday.
 */
export function calculateStreak(sessions: Session[]): { current: number; best: number } {
  if (sessions.length === 0) {
    return { current: 0, best: 0 };
  }

  // Get unique weeks that have sessions (year-week format)
  const weeksWithSessions = new Set<string>();
  for (const session of sessions) {
    const date = parseDate(session.date);
    const { year, week } = getWeekNumber(date);
    weeksWithSessions.add(`${year}-${week.toString().padStart(2, '0')}`);
  }

  if (weeksWithSessions.size === 0) {
    return { current: 0, best: 0 };
  }

  // Sort weeks descending (most recent first)
  const sortedWeeks = [...weeksWithSessions].sort().reverse();

  // Check if current week or last week has a session (for current streak)
  const today = new Date();
  const { year: currentYear, week: currentWeek } = getWeekNumber(today);
  const currentWeekKey = `${currentYear}-${currentWeek.toString().padStart(2, '0')}`;

  // Calculate last week
  const lastWeekDate = new Date(today);
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const { year: lastYear, week: lastWeek } = getWeekNumber(lastWeekDate);
  const lastWeekKey = `${lastYear}-${lastWeek.toString().padStart(2, '0')}`;

  const hasCurrentWeek = weeksWithSessions.has(currentWeekKey);
  const hasLastWeek = weeksWithSessions.has(lastWeekKey);
  const isRecent = hasCurrentWeek || hasLastWeek;

  // Helper to get the previous week key
  const getPrevWeekKey = (weekKey: string): string => {
    const [y, w] = weekKey.split('-').map(Number);
    if (w === 1) {
      // Go to last week of previous year (approximately week 52)
      return `${y - 1}-52`;
    }
    return `${y}-${(w - 1).toString().padStart(2, '0')}`;
  };

  // Calculate best streak
  let bestStreak = 1;
  let streak = 1;

  for (let i = 1; i < sortedWeeks.length; i++) {
    const expectedPrev = getPrevWeekKey(sortedWeeks[i - 1]);
    if (sortedWeeks[i] === expectedPrev) {
      streak += 1;
    } else {
      bestStreak = Math.max(bestStreak, streak);
      streak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, streak);

  // Calculate current streak (only if we climbed this week or last week)
  let currentStreak = 0;

  if (isRecent) {
    // Start from the most recent week with a session
    currentStreak = 1;
    let expectedWeek = getPrevWeekKey(sortedWeeks[0]);

    for (let i = 1; i < sortedWeeks.length; i++) {
      if (sortedWeeks[i] === expectedWeek) {
        currentStreak += 1;
        expectedWeek = getPrevWeekKey(sortedWeeks[i]);
      } else {
        break;
      }
    }
  }

  return { current: currentStreak, best: bestStreak };
}

// ============================================================================
// Trend Calculation
// ============================================================================

/**
 * Calculate trend between current and previous values.
 */
export function calculateTrend(current: number, previous: number): TrendResult {
  if (previous === 0) {
    if (current === 0) {
      return { direction: 'neutral', percentage: 0, diff: 0 };
    }
    return { direction: 'up', percentage: 100, diff: current };
  }

  const diff = current - previous;
  const percentage = Math.abs((diff / previous) * 100);

  if (Math.abs(diff) < 0.001) {
    return { direction: 'neutral', percentage: 0, diff: 0 };
  }

  return {
    direction: diff > 0 ? 'up' : 'down',
    percentage: Math.round(percentage),
    diff,
  };
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Extract canonical value from an attempt, handling various data shapes.
 */
function getCanonicalValue(attempt: Attempt): number {
  // Try direct canonicalValue
  if (typeof (attempt as any).canonicalValue === 'number') {
    return (attempt as any).canonicalValue;
  }

  // Try gradeSnapshot
  const snapshot = (attempt as any).gradeSnapshot;
  if (snapshot && typeof snapshot.canonicalValue === 'number') {
    return snapshot.canonicalValue;
  }

  // Fallback: estimate from grade string (V-scale)
  const grade = attempt.grade;
  if (grade.startsWith('V')) {
    const num = parseInt(grade.slice(1), 10);
    if (!isNaN(num)) return num;
  }

  return 0;
}

/**
 * Format a flash rate as a percentage string.
 */
export function formatFlashRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/**
 * Format a canonical value back to a grade label.
 * This is a simplified version - in production, use the grade system service.
 */
export function canonicalToGrade(canonical: number): string {
  if (canonical < 0) return '-';
  return `V${canonical}`;
}
