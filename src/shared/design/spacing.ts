/**
 * Climbing Tracker Design System - Spacing
 *
 * Consistent spacing system based on 4px grid
 * Ensures visual harmony across all screens
 */

// ============================================================================
// SPACING SCALE - 4px Base Unit
// ============================================================================

export const spacing = {
  none: 0,
  xxs: 2, // Hairline spacing
  xs: 4, // Tiny gaps
  sm: 8, // Small spacing, tight layouts
  md: 16, // Standard spacing between elements
  lg: 24, // Large spacing, section padding
  xl: 32, // Extra large spacing between sections
  xxl: 48, // Maximum spacing, major sections
  xxxl: 64, // Hero spacing
} as const;

// ============================================================================
// LAYOUT CONSTANTS - Common Use Cases
// ============================================================================

export const layout = {
  // Screen padding
  screenPadding: spacing.lg, // 24px - Sides of screen
  screenPaddingHorizontal: spacing.lg, // 24px
  screenPaddingVertical: spacing.lg, // 24px

  // Card spacing
  cardPadding: spacing.md, // 16px - Inside cards
  cardGap: spacing.md, // 16px - Between cards
  cardMargin: spacing.md, // 16px - Card from screen edge

  // Section spacing
  sectionSpacing: spacing.xl, // 32px - Between major sections
  sectionHeaderMargin: spacing.sm, // 8px - Below section headers

  // Element spacing
  elementSpacing: spacing.md, // 16px - Between related elements
  compactSpacing: spacing.sm, // 8px - Tight layouts
  tightSpacing: spacing.xs, // 4px - Very tight layouts

  // Form spacing
  inputSpacing: spacing.md, // 16px - Between form inputs
  labelMargin: spacing.xs, // 4px - Below labels
  formSectionSpacing: spacing.lg, // 24px - Between form sections

  // List spacing
  listItemPadding: spacing.md, // 16px - Inside list items
  listItemGap: spacing.sm, // 8px - Between list items
  listSectionGap: spacing.lg, // 24px - Between list sections

  // Button spacing
  buttonPadding: spacing.md, // 16px - Inside buttons
  buttonGap: spacing.sm, // 8px - Between buttons

  // Icon spacing
  iconMargin: spacing.sm, // 8px - Next to text
  iconPadding: spacing.xs, // 4px - Icon touch target padding

  // Tab bar
  tabBarHeight: 56, // Standard tab bar height
  tabBarPadding: spacing.sm, // 8px

  // Header
  headerHeight: 56, // Standard header height
  headerPadding: spacing.md, // 16px

  // Modal
  modalPadding: spacing.lg, // 24px
  modalMargin: spacing.md, // 16px from screen edge

  // Minimum touch target (iOS & Android guidelines)
  minTouchTarget: 44, // 44px minimum
  recommendedTouchTarget: 48, // 48px recommended
} as const;

// ============================================================================
// INSETS - Safe Area & Keyboard
// ============================================================================

export const insets = {
  top: 0, // Set dynamically by SafeAreaView
  bottom: 0, // Set dynamically by SafeAreaView
  left: 0,
  right: 0,
  keyboard: spacing.md, // Extra padding when keyboard is visible
} as const;

// ============================================================================
// CLIMBING-SPECIFIC SPACING
// ============================================================================

export const climbingSpacing = {
  // Grade badges
  gradeBadgePadding: spacing.sm, // 8px inside grade badge
  gradeBadgeGap: spacing.xs, // 4px between grade badges

  // Boulder list
  boulderPillGap: spacing.sm, // 8px between boulder pills
  boulderRowGap: spacing.md, // 16px between boulder rows

  // Stats display
  statCardGap: spacing.md, // 16px between stat cards
  statCardPadding: spacing.md, // 16px inside stat cards
  statRingSize: 120, // Progress ring size

  // Session cards
  sessionCardPadding: spacing.md, // 16px inside session cards
  sessionCardGap: spacing.md, // 16px between session cards
  sessionHeaderGap: spacing.sm, // 8px in session header

  // Activity feed
  activityItemGap: spacing.sm, // 8px between activity items
  activityItemPadding: spacing.md, // 16px inside activity items

  // Streak banner
  streakBannerPadding: spacing.md, // 16px inside streak banner
  streakIconMargin: spacing.sm, // 8px around fire icon
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get consistent padding for all sides
 */
export const pad = (size: keyof typeof spacing) => ({
  padding: spacing[size],
});

/**
 * Get consistent padding for specific sides
 */
export const padX = (size: keyof typeof spacing) => ({
  paddingHorizontal: spacing[size],
});

export const padY = (size: keyof typeof spacing) => ({
  paddingVertical: spacing[size],
});

export const padTop = (size: keyof typeof spacing) => ({
  paddingTop: spacing[size],
});

export const padBottom = (size: keyof typeof spacing) => ({
  paddingBottom: spacing[size],
});

export const padLeft = (size: keyof typeof spacing) => ({
  paddingLeft: spacing[size],
});

export const padRight = (size: keyof typeof spacing) => ({
  paddingRight: spacing[size],
});

/**
 * Get consistent margin for all sides
 */
export const margin = (size: keyof typeof spacing) => ({
  margin: spacing[size],
});

/**
 * Get consistent margin for specific sides
 */
export const marginX = (size: keyof typeof spacing) => ({
  marginHorizontal: spacing[size],
});

export const marginY = (size: keyof typeof spacing) => ({
  marginVertical: spacing[size],
});

export const marginTop = (size: keyof typeof spacing) => ({
  marginTop: spacing[size],
});

export const marginBottom = (size: keyof typeof spacing) => ({
  marginBottom: spacing[size],
});

export const marginLeft = (size: keyof typeof spacing) => ({
  marginLeft: spacing[size],
});

export const marginRight = (size: keyof typeof spacing) => ({
  marginRight: spacing[size],
});

/**
 * Get consistent gap for flexbox/grid
 */
export const gap = (size: keyof typeof spacing) => ({
  gap: spacing[size],
});

// ============================================================================
// EXPORTS
// ============================================================================

export const spacingSystem = {
  spacing,
  layout,
  insets,
  climbingSpacing,
  // Helpers
  pad,
  padX,
  padY,
  padTop,
  padBottom,
  padLeft,
  padRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  gap,
} as const;

export default spacingSystem;

// Type exports
export type Spacing = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[Spacing];
