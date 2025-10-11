/**
 * Climbing Copy Utility
 *
 * Translates generic app text into authentic climbing lingo.
 * Makes the app feel like it was built by climbers, for climbers.
 *
 * Usage:
 * import { climbText, climbAction, climbStatus } from '@/shared/utils/climbingCopy';
 *
 * climbText('save') // → "Send It"
 * climbAction('delete') // → "Chalk It Off"
 * climbStatus('success') // → "Crushed It!"
 */

// ============================================================================
// CLIMBING VOCABULARY
// ============================================================================

/**
 * Action verbs - climbing lingo for common actions
 */
export const climbingActions = {
  // Session actions
  save: 'Send It',
  log: 'Log Send',
  add: 'Add to Session',
  addBoulder: 'Log Another Send',
  edit: 'Update Beta',
  delete: 'Chalk It Off',
  remove: 'Scratch',

  // Navigation
  back: 'Downclimb',
  next: 'Push Through',
  skip: 'Take',
  cancel: 'Bail',
  close: 'Come Down',

  // Data actions
  refresh: 'Reset',
  retry: 'Give It Another Go',
  load: 'Chalk Up',
  loading: 'Chalking Up...',

  // Account
  signIn: 'Strap In',
  signOut: 'Rope Down',
  signUp: 'Join the Crew',

  // Misc
  confirm: 'Commit',
  filter: 'Sort Routes',
  search: 'Find Beta',
  share: 'Share the Send',
} as const;

/**
 * Status messages - climbing lingo for app states
 */
export const climbingStatus = {
  // Success
  success: 'Crushed It! 💪',
  saved: 'Sent! Nicely done.',
  added: 'Added to the logbook!',
  flashed: "Flash! You're on fire! 🔥",
  completed: 'Project Sent!',
  newRecord: 'New PR! Absolutely crushed it!',

  // Progress
  loading: 'Chalking up...',
  saving: 'Logging the send...',
  processing: 'Working the problem...',

  // Errors
  error: "Couldn't stick the send. Try again?",
  saveFailed: "Send didn't stick. Give it another go?",
  notFound: 'Route not found. Check your beta.',
  networkError: 'Lost connection. Like dropping off the wall.',
  permissionDenied: 'Access denied. Need clearance for this route.',

  // Empty states
  noSessions: 'No sends logged yet. Get after it!',
  noBoulders: 'Time to send! Tap the chalk bag to start.',
  noActivity: 'The wall is waiting. Log your first send!',
  restWeek: 'Rest week? Get back on the wall!',
  noResults: 'No routes found. Try different beta.',

  // Warnings
  unsaved: 'Unsaved changes. Your send will be lost!',
  confirmDelete: 'Chalk this off permanently?',
  logout: 'Rope down from your session?',
} as const;

/**
 * Labels - climbing lingo for UI elements
 */
export const climbingLabels = {
  // Stats
  sessionCount: 'Sends',
  totalSessions: 'Total Sends',
  bestGrade: 'Hardest Send',
  maxGrade: 'Max Grade',
  streak: 'Send Streak',
  flashRate: 'Flash Rate',
  attempts: 'Attempts',
  duration: 'Session Time',
  volume: 'Volume',

  // Session details
  boulders: 'Problems',
  grade: 'Grade',
  flashed: 'Flashed',
  sent: 'Sent',
  project: 'Project',
  notes: 'Beta Notes',
  date: 'Send Date',

  // Time periods
  today: "Today's Sends",
  thisWeek: 'This Week',
  thisMonth: 'This Month',
  thisYear: 'This Year',
  allTime: 'All Time',
  recent: 'Recent Activity',

  // Features
  dashboard: 'Home',
  log: 'Log Send',
  sessions: 'Logbook',
  stats: 'Progress',
  settings: 'Gear',
  profile: 'Climber',
} as const;

/**
 * Encouragement - motivational climbing phrases
 */
export const climbingEncouragement = {
  // Start of session
  beforeLog: 'Ready to crush?',
  emptyLog: 'First send of the day!',

  // During logging
  addAnother: 'Keep the send train rolling!',
  goodSession: "You're crushing it today!",
  flashStreak: 'On fire with those flashes!',

  // After session
  goodWork: 'Solid session! Nice work.',
  greatSession: 'Absolutely crushed it today!',
  newGrade: 'New grade unlocked! Keep pushing!',

  // Streaks
  streakActive: 'Keep the streak alive!',
  streakBroken: 'Ready to start a new streak?',

  // Progress
  improving: "You're progressing nicely!",
  consistent: 'Consistency is key. Keep at it!',

  // Rest
  restDay: 'Recovery is part of the process.',
  comeback: "Welcome back! Let's get after it.",
} as const;

/**
 * Tooltips & Help - climbing-friendly explanations
 */
export const climbingHelp = {
  flash: 'Completed on first try (no falls)',
  send: 'Successfully completed the route',
  project: "Route you're working on (not sent yet)",
  attempts: 'Number of tries before sending',
  grade: 'Difficulty rating (V-Scale or Font)',
  session: 'A climbing session at the gym or crag',
  streak: 'Consecutive days with logged sends',
  volume: 'Total number of routes climbed',
  flashRate: 'Percentage of routes flashed',

  // Feature explanations
  gradeSystem: "Choose V-Scale, Font, or your gym's system",
  displaySystem: 'How you want to view all your sessions',
  loggingSystem: 'The system used at the gym for this session',
  canonicalGrade: 'Normalized grade for cross-system comparison',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get climbing lingo for an action
 * @param key - Action key
 * @returns Climbing lingo or fallback to key
 */
export const climbAction = (key: keyof typeof climbingActions | string): string => {
  return climbingActions[key as keyof typeof climbingActions] || key;
};

/**
 * Get climbing lingo for a status message
 * @param key - Status key
 * @returns Climbing lingo or fallback to key
 */
export const climbStatus = (key: keyof typeof climbingStatus | string): string => {
  return climbingStatus[key as keyof typeof climbingStatus] || key;
};

/**
 * Get climbing lingo for a label
 * @param key - Label key
 * @returns Climbing lingo or fallback to key
 */
export const climbLabel = (key: keyof typeof climbingLabels | string): string => {
  return climbingLabels[key as keyof typeof climbingLabels] || key;
};

/**
 * Get climbing encouragement
 * @param key - Encouragement key
 * @returns Encouraging climbing phrase
 */
export const climbEncourage = (key: keyof typeof climbingEncouragement | string): string => {
  return climbingEncouragement[key as keyof typeof climbingEncouragement] || key;
};

/**
 * Get climbing help text
 * @param key - Help key
 * @returns Helpful explanation in climbing terms
 */
export const climbHelp = (key: keyof typeof climbingHelp | string): string => {
  return climbingHelp[key as keyof typeof climbingHelp] || key;
};

/**
 * General text converter - tries all dictionaries
 * @param text - Generic text
 * @returns Climbing lingo version
 */
export const climbText = (text: string): string => {
  const lowerText = text.toLowerCase();

  // Try actions first
  if (lowerText in climbingActions) {
    return climbAction(lowerText);
  }

  // Try status
  if (lowerText in climbingStatus) {
    return climbStatus(lowerText);
  }

  // Try labels
  if (lowerText in climbingLabels) {
    return climbLabel(lowerText);
  }

  // Fallback to original
  return text;
};

/**
 * Convert session count to climbing lingo
 * @param count - Number of sessions
 * @returns "X sends" or "No sends yet"
 */
export const climbSessionCount = (count: number): string => {
  if (count === 0) return 'No sends yet';
  if (count === 1) return '1 send';
  return `${count} sends`;
};

/**
 * Convert flash indicator to celebration
 * @param flashed - Whether route was flashed
 * @returns Celebration text
 */
export const climbFlashText = (flashed: boolean): string => {
  return flashed ? '⚡ Flashed!' : 'Sent';
};

/**
 * Convert streak to motivational text
 * @param days - Streak length in days
 * @returns Streak text with fire emoji
 */
export const climbStreakText = (days: number): string => {
  if (days === 0) return 'Start a streak!';
  if (days === 1) return '🔥 1 day streak';
  if (days >= 7) return `🔥🔥 ${days} day streak! On fire!`;
  return `🔥 ${days} day streak`;
};

/**
 * Convert grade progression to encouragement
 * @param oldGrade - Previous max grade
 * @param newGrade - New max grade
 * @returns Celebration text
 */
export const climbGradeProgress = (oldGrade: string, newGrade: string): string => {
  return `New PR! ${oldGrade} → ${newGrade}. Absolutely crushed it!`;
};

/**
 * Format attempts count for display
 * @param attempts - Number of attempts
 * @returns Human-friendly attempt text
 */
export const climbAttemptsText = (attempts: number): string => {
  if (attempts === 1) return 'Flashed (1st try)';
  if (attempts === 2) return 'Sent (2nd go)';
  if (attempts === 3) return 'Sent (3rd go)';
  return `Sent (${attempts} attempts)`;
};

// ============================================================================
// EXPORTS
// ============================================================================

export const climbingCopy = {
  actions: climbingActions,
  status: climbingStatus,
  labels: climbingLabels,
  encouragement: climbingEncouragement,
  help: climbingHelp,

  // Helper functions
  climbAction,
  climbStatus,
  climbLabel,
  climbEncourage,
  climbHelp,
  climbText,
  climbSessionCount,
  climbFlashText,
  climbStreakText,
  climbGradeProgress,
  climbAttemptsText,
} as const;

export default climbingCopy;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ClimbingAction = keyof typeof climbingActions;
export type ClimbingStatus = keyof typeof climbingStatus;
export type ClimbingLabel = keyof typeof climbingLabels;
export type ClimbingEncouragement = keyof typeof climbingEncouragement;
export type ClimbingHelp = keyof typeof climbingHelp;
