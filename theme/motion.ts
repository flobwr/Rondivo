import { Easing } from 'react-native';

/**
 * Rondivo motion — state, not decoration.
 *
 * Everything the app animates falls into four durations and two springs.
 * All curves decelerate (ease-out family); nothing bounces, nothing loops
 * for show. Honour `useReducedMotion` at every call site.
 */

export const Motion = {
  /** Press feedback, highlights. */
  instant: 120,
  /** List row fades, chip/segment changes. */
  fast: 180,
  /** Screen-level content appearing. */
  base: 240,
  /** Sheets, large surface movement. */
  slow: 320,

  /** The house deceleration curve (cubic ease-out). */
  easeOut: Easing.bezier(0.16, 1, 0.3, 1),
} as const;

// ——— RN Animated spring presets ———

/** Press feedback (PressableScale) — quick in, gentle settle out. */
export const PressSpring = {
  in: { friction: 7, tension: 320 },
  out: { friction: 5, tension: 140 },
} as const;

/** Focus rings, selection indicators — soft, no overshoot. */
export const SettleSpring = { friction: 9, tension: 140 } as const;

// ——— Screen choreography ———

/** Content fade after a skeleton resolves. */
export const ScreenFadeInDuration = Motion.base;
/** List rows appearing / filter changes. */
export const ListFadeInDuration = Motion.fast;
/** Per-row stagger for list entrances — capped so lists never feel slow. */
export const StaggerRowDelay = 24;
export const StaggerRowCap = 6;
/** Ambient skeleton shimmer loop. */
export const ShimmerDuration = 1000;
