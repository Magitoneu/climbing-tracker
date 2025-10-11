/**
 * Climbing Tracker Design System - Typography
 *
 * Typography inspired by climbing culture:
 * - Bold, confident headers (like climbers)
 * - Clear hierarchy (like route grades)
 * - Tabular numbers for grades and stats (V5, V10 align perfectly)
 * - Strong visual presence
 *
 * Font strategy:
 * - System fonts for maximum performance
 * - Bold weights for strength and confidence
 * - Tabular numerals for grade alignment
 * - Uppercase for section headers (like gym signs)
 */

import { TextStyle } from 'react-native';

// ============================================================================
// FONT WEIGHTS
// ============================================================================

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
} as const;

// ============================================================================
// DISPLAY TYPOGRAPHY - Large, Bold, Commanding
// ============================================================================
// Use for: Hero text, empty states, major headers
// Personality: Strong, confident, like a climber's determination

export const display: TextStyle = {
  fontFamily: 'System',
  fontSize: 34,
  fontWeight: fontWeights.extrabold,
  lineHeight: 42,
  letterSpacing: -0.5,
};

export const displayLarge: TextStyle = {
  fontFamily: 'System',
  fontSize: 40,
  fontWeight: fontWeights.black,
  lineHeight: 48,
  letterSpacing: -0.8,
};

// ============================================================================
// HEADINGS - Clear Hierarchy
// ============================================================================

export const h1: TextStyle = {
  fontFamily: 'System',
  fontSize: 28,
  fontWeight: fontWeights.bold,
  lineHeight: 36,
  letterSpacing: -0.3,
};

export const h2: TextStyle = {
  fontFamily: 'System',
  fontSize: 24,
  fontWeight: fontWeights.semibold,
  lineHeight: 32,
  letterSpacing: 0,
};

export const h3: TextStyle = {
  fontFamily: 'System',
  fontSize: 20,
  fontWeight: fontWeights.semibold,
  lineHeight: 28,
  letterSpacing: 0,
};

export const h4: TextStyle = {
  fontFamily: 'System',
  fontSize: 18,
  fontWeight: fontWeights.semibold,
  lineHeight: 24,
  letterSpacing: 0,
};

// ============================================================================
// BODY TEXT - Readable, Clear
// ============================================================================

export const body: TextStyle = {
  fontFamily: 'System',
  fontSize: 16,
  fontWeight: fontWeights.regular,
  lineHeight: 24,
  letterSpacing: 0,
};

export const bodyBold: TextStyle = {
  fontFamily: 'System',
  fontSize: 16,
  fontWeight: fontWeights.semibold,
  lineHeight: 24,
  letterSpacing: 0,
};

export const bodySmall: TextStyle = {
  fontFamily: 'System',
  fontSize: 14,
  fontWeight: fontWeights.regular,
  lineHeight: 20,
  letterSpacing: 0,
};

export const bodySmallBold: TextStyle = {
  fontFamily: 'System',
  fontSize: 14,
  fontWeight: fontWeights.semibold,
  lineHeight: 20,
  letterSpacing: 0,
};

// ============================================================================
// NUMBERS - Grades, Stats, Metrics
// ============================================================================
// Tabular numerals ensure V5 and V10 align perfectly
// Use for: Grade displays, stat counters, session counts

export const numeric: TextStyle = {
  fontFamily: 'System',
  fontSize: 32,
  fontWeight: fontWeights.bold,
  lineHeight: 40,
  letterSpacing: 0,
  fontVariant: ['tabular-nums'] as any,
};

export const numericLarge: TextStyle = {
  fontFamily: 'System',
  fontSize: 48,
  fontWeight: fontWeights.extrabold,
  lineHeight: 56,
  letterSpacing: -1,
  fontVariant: ['tabular-nums'] as any,
};

export const numericSmall: TextStyle = {
  fontFamily: 'System',
  fontSize: 24,
  fontWeight: fontWeights.bold,
  lineHeight: 32,
  letterSpacing: 0,
  fontVariant: ['tabular-nums'] as any,
};

// ============================================================================
// GRADE DISPLAY - Special Treatment for Climbing Grades
// ============================================================================
// Grades are sacred in climbing - they deserve special typography

export const grade: TextStyle = {
  fontFamily: 'System',
  fontSize: 20,
  fontWeight: fontWeights.bold,
  lineHeight: 24,
  letterSpacing: 0.5,
  fontVariant: ['tabular-nums'] as any,
};

export const gradeLarge: TextStyle = {
  fontFamily: 'System',
  fontSize: 28,
  fontWeight: fontWeights.extrabold,
  lineHeight: 32,
  letterSpacing: 0,
  fontVariant: ['tabular-nums'] as any,
};

export const gradeSmall: TextStyle = {
  fontFamily: 'System',
  fontSize: 16,
  fontWeight: fontWeights.bold,
  lineHeight: 20,
  letterSpacing: 0.25,
  fontVariant: ['tabular-nums'] as any,
};

// ============================================================================
// UI ELEMENTS
// ============================================================================

export const button: TextStyle = {
  fontFamily: 'System',
  fontSize: 16,
  fontWeight: fontWeights.semibold,
  letterSpacing: 0.5,
  textTransform: 'none',
};

export const buttonLarge: TextStyle = {
  fontFamily: 'System',
  fontSize: 18,
  fontWeight: fontWeights.bold,
  letterSpacing: 0.5,
  textTransform: 'none',
};

export const buttonSmall: TextStyle = {
  fontFamily: 'System',
  fontSize: 14,
  fontWeight: fontWeights.semibold,
  letterSpacing: 0.25,
  textTransform: 'none',
};

// ============================================================================
// LABELS & CAPTIONS
// ============================================================================

export const caption: TextStyle = {
  fontFamily: 'System',
  fontSize: 14,
  fontWeight: fontWeights.regular,
  lineHeight: 20,
  letterSpacing: 0,
};

export const captionBold: TextStyle = {
  fontFamily: 'System',
  fontSize: 14,
  fontWeight: fontWeights.semibold,
  lineHeight: 20,
  letterSpacing: 0,
};

export const label: TextStyle = {
  fontFamily: 'System',
  fontSize: 12,
  fontWeight: fontWeights.medium,
  lineHeight: 16,
  letterSpacing: 0.5,
};

export const labelBold: TextStyle = {
  fontFamily: 'System',
  fontSize: 12,
  fontWeight: fontWeights.semibold,
  lineHeight: 16,
  letterSpacing: 0.5,
};

// ============================================================================
// OVERLINE - Section Headers, Categories
// ============================================================================
// Use for: "WEEKLY PROGRESS", "GRADE PYRAMID", "RECENT ACTIVITY"
// Personality: Gym sign energy, route setter labels

export const overline: TextStyle = {
  fontFamily: 'System',
  fontSize: 12,
  fontWeight: fontWeights.bold,
  lineHeight: 16,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
};

export const overlineLarge: TextStyle = {
  fontFamily: 'System',
  fontSize: 14,
  fontWeight: fontWeights.extrabold,
  lineHeight: 20,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
};

// ============================================================================
// SPECIAL - Climbing-Specific Typography
// ============================================================================

// Flash indicator - celebratory, exciting
export const flash: TextStyle = {
  fontFamily: 'System',
  fontSize: 18,
  fontWeight: fontWeights.extrabold,
  lineHeight: 24,
  letterSpacing: 1,
  textTransform: 'uppercase',
};

// Send badge - achievement unlocked
export const sendBadge: TextStyle = {
  fontFamily: 'System',
  fontSize: 24,
  fontWeight: fontWeights.black,
  lineHeight: 32,
  letterSpacing: 2,
  textTransform: 'uppercase',
};

// Streak counter - fire energy
export const streak: TextStyle = {
  fontFamily: 'System',
  fontSize: 20,
  fontWeight: fontWeights.extrabold,
  lineHeight: 24,
  letterSpacing: 0.5,
  fontVariant: ['tabular-nums'] as any,
};

// ============================================================================
// TYPOGRAPHY SYSTEM OBJECT
// ============================================================================

export const typography = {
  // Display
  display,
  displayLarge,

  // Headings
  h1,
  h2,
  h3,
  h4,

  // Body
  body,
  bodyBold,
  bodySmall,
  bodySmallBold,

  // Numbers
  numeric,
  numericLarge,
  numericSmall,

  // Grades
  grade,
  gradeLarge,
  gradeSmall,

  // UI
  button,
  buttonLarge,
  buttonSmall,
  caption,
  captionBold,
  label,
  labelBold,
  overline,
  overlineLarge,

  // Special
  flash,
  sendBadge,
  streak,

  // Weights
  weights: fontWeights,
} as const;

export default typography;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Combine typography styles with custom overrides
 * @example
 * const myStyle = withTypography(typography.h1, { color: colors.primary });
 */
export const withTypography = (baseStyle: TextStyle, overrides: TextStyle = {}): TextStyle => ({
  ...baseStyle,
  ...overrides,
});

/**
 * Create responsive typography based on screen size
 * @param base - Base font size
 * @param scale - Scale factor (default 1.2)
 */
export const createResponsiveTypography = (
  base: number,
  scale: number = 1.2
): {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
} => ({
  xs: Math.round(base / (scale * scale)),
  sm: Math.round(base / scale),
  md: base,
  lg: Math.round(base * scale),
  xl: Math.round(base * scale * scale),
});

// Type exports
export type Typography = typeof typography;
export type TypographyKey = keyof typeof typography;
export type FontWeight = keyof typeof fontWeights;
