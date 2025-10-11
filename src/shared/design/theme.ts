/**
 * Climbing Tracker Design System - Theme
 *
 * A climbing-inspired color palette that evokes the spirit of the sport:
 * - Sandstone sunset oranges (adventure, challenge, golden hour)
 * - Chalk whites (ritual, preparation, essential tool)
 * - Earth tones (rock, nature, outdoor connection)
 * - Bright hold colors (gym energy, playful progression)
 *
 * Each color tells a story from climbing culture.
 */

// ============================================================================
// PRIMARY COLORS - Sandstone Sunset
// ============================================================================
// Inspired by: Red Rock Canyon at golden hour, El Capitan sunset, sandstone faces
// Psychology: Warmth, adventure, challenge, caution, send energy

export const primary = {
  50: '#FFF8E1', // Chalk dust in morning light
  100: '#FFECB3', // Light sandstone
  200: '#FFE082', // Warm sandstone glow
  300: '#FFD54F', // Bright sun on rock
  400: '#FFCA28', // Golden hour approach
  500: '#FFA726', // PRIMARY - Sunset on El Cap (main brand color)
  600: '#FF9800', // Peak send energy
  700: '#F57C00', // Deep orange - challenging territory
  800: '#EF6C00', // Intense send focus
  900: '#E65100', // Burnt orange - elite zone
} as const;

// ============================================================================
// CHALK & STONE - Neutrals with Climbing Character
// ============================================================================

export const chalk = {
  white: '#FAFAFA', // Fresh chalk, pure and clean
  dust: '#F5F5F5', // Chalk dust cloud after clap
  bag: '#EEEEEE', // Chalk bag fabric texture
  smudge: '#E8E8E8', // Chalk marks on holds
  worn: '#DEDEDE', // Well-used chalk bag
} as const;

export const stone = {
  granite: '#8B8B8D', // Granite texture - strong, reliable
  sandstone: '#D4A574', // Sandstone warm tones
  limestone: '#E8DCC4', // Limestone light surface
  basalt: '#4A4A4A', // Dark volcanic rock
  slate: '#6B7280', // Slate gray - indoor walls
} as const;

// ============================================================================
// ACCENT COLORS - Send Energy & Celebrations
// ============================================================================

export const accent = {
  flash: '#FBC02D', // Gold - perfect send, first-try success
  send: '#FF6F3C', // Orange-red - completion, achievement
  fire: '#FF5722', // Red-orange - on fire, hot streak burning
  chalk: '#FFFFFF', // Pure chalk white
  project: '#FFA000', // Amber - working on it, progression
} as const;

// ============================================================================
// CLIMBING HOLD COLORS - Gym Energy
// ============================================================================
// Inspired by: Colorful gym hold sets, tape colors, route difficulty

export const hold = {
  jug: '#4CAF50', // Green - easy holds, beginner-friendly
  crimp: '#2196F3', // Blue - intermediate, technical
  sloper: '#9C27B0', // Purple - advanced, requires technique
  pinch: '#FF9800', // Orange - challenging grip strength
  microCrimp: '#F44336', // Red - elite, maximum difficulty
  volume: '#FF6F00', // Deep orange - large features
} as const;

// ============================================================================
// SEMANTIC COLORS - Climbing Outcomes
// ============================================================================

export const semantic = {
  flash: '#FBC02D', // Gold (flashed = perfect first-try send)
  send: '#43A047', // Green (sent = completed successfully)
  project: '#FFA000', // Amber (working on it, not sent yet)
  attempt: '#78909C', // Blue-gray (tried but didn't send)
  failure: '#E53935', // Red (fell off, couldn't complete)
  rest: '#64B5F6', // Light blue (rest day, recovery)
  success: '#43A047', // Green (general success)
  warning: '#FF9800', // Orange (caution, challenging)
  error: '#E53935', // Red (error, problem)
  info: '#2196F3', // Blue (information)
} as const;

// ============================================================================
// UI COLORS - Interface Elements
// ============================================================================

export const colors = {
  // Primary climbing brand
  primary: primary[500],
  primaryLight: primary[300],
  primaryDark: primary[700],

  // Accents
  accent: accent.send,
  accentLight: accent.flash,
  accentDark: accent.fire,

  // Backgrounds
  background: chalk.dust, // Main app background - chalk dust
  surface: chalk.white, // Card/surface background - fresh chalk
  surfaceElevated: '#FFFFFF', // Elevated surfaces

  // Text
  text: '#22223B', // Deep blue-gray - primary text
  textSecondary: '#64748B', // Slate - secondary text
  textTertiary: '#94A3B8', // Light slate - tertiary text
  textInverse: '#FFFFFF', // White text on dark backgrounds
  textOnPrimary: '#FFFFFF', // Text on primary color

  // Borders & Dividers
  border: '#E5EAF2', // Subtle borders
  divider: '#E2E8F0', // Section dividers
  borderFocus: primary[500], // Focused input border

  // States
  disabled: '#B0BEC5', // Disabled elements
  overlay: 'rgba(0, 0, 0, 0.4)', // Modal overlay
  shadow: 'rgba(0, 0, 0, 0.1)', // Shadows

  // Semantic
  success: semantic.success,
  warning: semantic.warning,
  error: semantic.error,
  info: semantic.info,

  // Climbing-specific
  flash: accent.flash,
  send: accent.send,
  fire: accent.fire,
  project: accent.project,

  // Legacy compatibility (for gradual migration)
  tabInactive: '#A0A3BD',
  chipSelected: primary[500],
  chipUnselected: '#FFFFFF',
  chipBorder: primary[500],
} as const;

// ============================================================================
// SHADOWS - Depth & Elevation
// ============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ============================================================================
// GRADIENTS - Dynamic Visual Interest
// ============================================================================

export const gradients = {
  sunset: ['#FF9800', '#F57C00', '#E65100'], // Sandstone sunset
  chalk: ['#FFFFFF', '#F5F5F5', '#EEEEEE'], // Chalk cloud
  fire: ['#FF5722', '#FF6F3C', '#FFA726'], // Send fire
  difficulty: ['#4CAF50', '#FF9800', '#F44336'], // Easy → Hard
  rock: ['#D4A574', '#8B8B8D', '#4A4A4A'], // Stone types
} as const;

// ============================================================================
// BORDER RADIUS - Organic Climbing Shapes
// ============================================================================
// Climbing holds aren't perfect circles - add organic character

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
  // Climbing-specific: organic, slightly asymmetric (for hold-shaped elements)
  hold: 12, // Base radius for hold-shaped buttons
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const climbingTheme = {
  primary,
  chalk,
  stone,
  accent,
  hold,
  semantic,
  colors,
  shadows,
  gradients,
  borderRadius,
} as const;

export default climbingTheme;

// Type exports for TypeScript
export type ClimbingTheme = typeof climbingTheme;
export type PrimaryColor = keyof typeof primary;
export type ChalkColor = keyof typeof chalk;
export type StoneColor = keyof typeof stone;
export type AccentColor = keyof typeof accent;
export type HoldColor = keyof typeof hold;
export type SemanticColor = keyof typeof semantic;
