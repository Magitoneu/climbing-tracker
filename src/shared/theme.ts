/**
 * Climbing Tracker Theme - Legacy Compatibility Layer
 *
 * This file maintains backward compatibility with existing components
 * while gradually migrating to the new climbing-inspired design system.
 *
 * For new components, import from:
 * - @/shared/design/theme (colors)
 * - @/shared/design/typography (typography)
 * - @/shared/design/spacing (spacing)
 */

// Import new climbing design system
import { colors as climbingColors, primary, accent, chalk, shadows } from './design/theme';
import { typography } from './design/typography';
import { spacing } from './design/spacing';

// ============================================================================
// GRADE COLORS - Keep existing grade color palette
// ============================================================================
export const gradeColors: Record<string, string> = {
  VB: '#B3E5FC',
  '3–4': '#B3E5FC',
  V0: '#81D4FA',
  '4–4+': '#81D4FA',
  V1: '#4FC3F7',
  '5–5+': '#4FC3F7',
  V2: '#29B6F6',
  '5+–6A': '#29B6F6',
  V3: '#26A69A',
  '6A–6A+': '#26A69A',
  V4: '#009688',
  '6B–6B+': '#009688',
  V5: '#00897B',
  '6C–6C+': '#00897B',
  V6: '#00695C',
  '7A': '#00695C',
  V7: '#5E35B1',
  '7A+': '#5E35B1',
  V8: '#3949AB',
  '7B': '#3949AB',
  V9: '#1E88E5',
  '7B+': '#1E88E5',
  V10: '#43A047',
  '7C': '#43A047',
  V11: '#388E3C',
  '7C+': '#388E3C',
  V12: '#FBC02D',
  '8A': '#FBC02D',
  V13: '#FFA000',
  '8A+': '#FFA000',
  V14: '#F57C00',
  '8B': '#F57C00',
  V15: '#E64A19',
  '8B+': '#E64A19',
  V16: '#8D6E63',
  '8C': '#8D6E63',
  V17: '#6D4C41',
  '9A': '#6D4C41',
};

// ============================================================================
// COLORS - Updated with climbing theme
// ============================================================================
export const colors = {
  // Primary colors - Climbing-inspired orange/amber
  primary: climbingColors.primary, // #FFA726 - Sandstone sunset
  primaryLight: primary[300], // Lighter sandstone
  primaryDark: primary[700], // Deep orange

  // Accent
  accent: climbingColors.accent, // #FF6F3C - Send energy

  // Backgrounds - Chalk inspired
  background: chalk.dust, // #F5F5F5 - Chalk dust
  surface: chalk.white, // #FAFAFA - Fresh chalk

  // Text
  text: climbingColors.text, // #22223B - Deep blue-gray
  textSecondary: climbingColors.textSecondary, // #64748B
  textInverse: climbingColors.textInverse, // #FFFFFF

  // States
  error: climbingColors.error, // #E53935
  success: climbingColors.success, // #43A047
  warning: climbingColors.warning, // #FF9800
  info: climbingColors.info, // #2196F3

  // UI
  border: climbingColors.border, // #E5EAF2
  divider: climbingColors.divider, // #E2E8F0

  // Climbing-specific
  flash: accent.flash, // #FBC02D - Gold for flashes
  send: accent.send, // #FF6F3C - Send completion
  fire: accent.fire, // #FF5722 - Hot streak

  // Legacy compatibility
  chipSelected: primary[500],
  chipUnselected: chalk.white,
  chipBorder: primary[500],
  tabInactive: '#A0A3BD',
};

// ============================================================================
// BUTTON STYLES - Updated with climbing theme
// ============================================================================
export const buttonStyle = {
  backgroundColor: colors.primary,
  borderRadius: 12, // Less round, more climbing-hold-like
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  alignItems: 'center' as const,
  ...shadows.md,
};

export const buttonText = {
  ...typography.button,
  color: colors.textInverse,
};

// ============================================================================
// INPUT STYLES - Updated with climbing theme
// ============================================================================
export const inputStyle = {
  borderWidth: 0,
  borderRadius: 12,
  padding: spacing.md,
  backgroundColor: colors.surface,
  color: colors.text,
  marginBottom: spacing.sm,
  fontSize: 16,
  ...shadows.sm,
};

// ============================================================================
// CHIP STYLES - Updated with climbing theme
// ============================================================================
export const chipStyle = {
  borderWidth: 1,
  borderColor: colors.chipBorder,
  borderRadius: 20,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  marginRight: spacing.sm,
  backgroundColor: colors.chipUnselected,
  minWidth: 48,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const chipSelectedStyle = {
  backgroundColor: colors.chipSelected,
  borderColor: colors.chipSelected,
};

// ============================================================================
// RE-EXPORTS - Make new design system easily accessible
// ============================================================================

// Export design system modules
export { typography } from './design/typography';
export { spacing, layout } from './design/spacing';
export { shadows, borderRadius } from './design/theme';
export { climbingCopy } from './utils/climbingCopy';

// Export climbing-specific colors for easy access
export { primary, accent, chalk } from './design/theme';
