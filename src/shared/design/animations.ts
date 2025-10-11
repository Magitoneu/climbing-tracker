/**
 * Climbing Tracker Design System - Animations
 *
 * Animation timing and easing functions for consistent motion
 * Climbing-inspired animations feel energetic and confident
 */

// ============================================================================
// DURATION - Animation Timing
// ============================================================================

export const duration = {
  instant: 0, // No animation
  fast: 150, // Quick interactions (button press, toggle)
  normal: 300, // Standard transitions (screen change, modal)
  slow: 500, // Emphasized animations (celebration, reveal)
  slower: 800, // Stat count-up, progress animations
  slowest: 1200, // Loading states, background animations
} as const;

// ============================================================================
// EASING - Animation Curves
// ============================================================================

export const easing = {
  // Standard easings
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Custom bezier curves for climbing-feel
  // Sharp and confident, like a dynamic move
  dynamic: 'cubic-bezier(0.4, 0.0, 0.2, 1)',

  // Smooth entry, explosive exit (like a send)
  send: 'cubic-bezier(0.0, 0.0, 0.2, 1)',

  // Bounce (like landing on crash pad)
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // Spring (like rope stretch)
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

// ============================================================================
// ANIMATION CONFIGS - Common Use Cases
// ============================================================================

export const animations = {
  // Quick UI feedback
  quick: {
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Standard interactions
  standard: {
    duration: duration.normal,
    easing: easing.easeInOut,
  },

  // Screen transitions
  screen: {
    duration: duration.normal,
    easing: easing.dynamic,
  },

  // Modal appearances
  modal: {
    duration: duration.normal,
    easing: easing.spring,
  },

  // Button press (compression effect)
  buttonPress: {
    duration: duration.fast,
    easing: easing.easeOut,
    scale: 0.95,
  },

  // Stat counter (count-up effect)
  statCounter: {
    duration: duration.slower,
    easing: easing.easeOut,
  },

  // Loading states
  loading: {
    duration: duration.slowest,
    easing: easing.linear,
    loop: true,
  },

  // Success animations
  success: {
    duration: duration.slow,
    easing: easing.bounce,
    scale: 1.2,
  },

  // Flash celebration (chalk dust explosion)
  flash: {
    duration: duration.slow,
    easing: easing.easeOut,
  },

  // Send badge (achievement reveal)
  sendBadge: {
    duration: duration.slow,
    easing: easing.spring,
    scale: 1.1,
  },

  // Fire animation (streak banner)
  fire: {
    duration: 800,
    easing: easing.linear,
    loop: true,
  },

  // Fade in/out
  fade: {
    duration: duration.normal,
    easing: easing.easeInOut,
  },

  // Slide in from bottom (like modal)
  slideUp: {
    duration: duration.normal,
    easing: easing.dynamic,
  },

  // Slide in from right (like drawer)
  slideIn: {
    duration: duration.normal,
    easing: easing.dynamic,
  },

  // Scale in (like badge appearing)
  scaleIn: {
    duration: duration.slow,
    easing: easing.spring,
  },

  // Rotate (for loading spinner)
  rotate: {
    duration: duration.slowest,
    easing: easing.linear,
    loop: true,
  },
} as const;

// ============================================================================
// CLIMBING-SPECIFIC ANIMATIONS
// ============================================================================

export const climbingAnimations = {
  // Chalk dust particles on flash
  chalkDust: {
    duration: 1000,
    easing: easing.easeOut,
    particleCount: 20,
    spread: 60,
  },

  // Chalk bag shake (loading)
  chalkBagShake: {
    duration: 600,
    easing: easing.easeInOut,
    loop: true,
    amplitude: 3, // pixels
  },

  // Progress ring fill (like climbing route)
  progressRing: {
    duration: 800,
    easing: easing.dynamic,
    delay: 200, // Stagger multiple rings
  },

  // Grade badge pop-in
  gradeBadge: {
    duration: 400,
    easing: easing.spring,
    scale: 1.15,
    rotate: 2, // degrees (slight tilt)
  },

  // Send celebration sequence
  sendCelebration: {
    badge: {
      duration: 600,
      easing: easing.spring,
      delay: 0,
    },
    confetti: {
      duration: 1200,
      easing: easing.easeOut,
      delay: 200,
    },
    message: {
      duration: 400,
      easing: easing.easeOut,
      delay: 400,
    },
  },

  // Streak fire flicker
  streakFire: {
    duration: 1000,
    easing: easing.linear,
    loop: true,
    scale: [1, 1.1, 0.95, 1.05, 1],
    opacity: [1, 0.9, 1, 0.95, 1],
  },

  // Boulder card expand
  boulderExpand: {
    duration: 300,
    easing: easing.dynamic,
  },

  // Hold-shaped button press (feels tactile)
  holdPress: {
    duration: 150,
    easing: easing.easeOut,
    scale: 0.95,
    opacity: 0.8,
  },
} as const;

// ============================================================================
// SPRING CONFIGS (for react-native-reanimated)
// ============================================================================

export const springConfigs = {
  // Gentle spring
  gentle: {
    damping: 20,
    mass: 1,
    stiffness: 120,
  },

  // Standard spring
  standard: {
    damping: 15,
    mass: 1,
    stiffness: 150,
  },

  // Bouncy spring (like crash pad)
  bouncy: {
    damping: 10,
    mass: 1,
    stiffness: 200,
  },

  // Snappy spring
  snappy: {
    damping: 25,
    mass: 0.5,
    stiffness: 300,
  },
} as const;

// ============================================================================
// TIMING CONFIGS (for react-native-reanimated)
// ============================================================================

export const timingConfigs = {
  fast: {
    duration: duration.fast,
  },
  normal: {
    duration: duration.normal,
  },
  slow: {
    duration: duration.slow,
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a staggered animation config for list items
 * @param itemCount - Number of items to animate
 * @param baseDelay - Base delay between items (ms)
 */
export const createStaggered = (itemCount: number, baseDelay: number = 50) => {
  return Array.from({ length: itemCount }, (_, index) => ({
    delay: index * baseDelay,
  }));
};

/**
 * Create a loop animation config
 * @param duration - Duration of one loop
 * @param iterations - Number of iterations (Infinity for infinite)
 */
export const createLoop = (duration: number, iterations: number = Infinity) => ({
  duration,
  iterations,
});

/**
 * Combine multiple animation configs
 */
export const combineAnimations = (...configs: any[]) => {
  return configs.reduce((acc, config) => ({ ...acc, ...config }), {});
};

// ============================================================================
// EXPORTS
// ============================================================================

export const animationSystem = {
  duration,
  easing,
  animations,
  climbingAnimations,
  springConfigs,
  timingConfigs,
  // Helpers
  createStaggered,
  createLoop,
  combineAnimations,
} as const;

export default animationSystem;

// Type exports
export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type AnimationConfig = (typeof animations)[keyof typeof animations];
export type ClimbingAnimationConfig = (typeof climbingAnimations)[keyof typeof climbingAnimations];
