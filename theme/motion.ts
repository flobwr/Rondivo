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

// ——— Timing configs ———

/**
 * Ready-to-spread `Animated.timing` configs, named by **interaction type**
 * rather than by speed.
 *
 * A duration alone is not a decision: `duration: 180` with no easing is a
 * linear animation, and the app had five screens doing exactly that. Pairing
 * each duration with its curve *here* means a call site cannot forget the
 * curve, and cannot pick a different one.
 *
 * @example
 * Animated.timing(v, { toValue: 1, useNativeDriver: true, ...Timing.content })
 */
export const Timing = {
  /** Press feedback, highlights, colour crossfades. */
  micro: { duration: Motion.instant, easing: Motion.easeOut },
  /** Chips, segments, list rows, small state changes. */
  quick: { duration: Motion.fast, easing: Motion.easeOut },
  /** Cards and screen content appearing. */
  content: { duration: Motion.base, easing: Motion.easeOut },
  /** Sheets and large surfaces. */
  surface: { duration: Motion.slow, easing: Motion.easeOut },
} as const;

export type TimingToken = (typeof Timing)[keyof typeof Timing];

// ——— RN Animated spring presets ———

/** Press feedback (PressableScale) — quick in, gentle settle out. */
export const PressSpring = {
  in: { friction: 7, tension: 320 },
  out: { friction: 5, tension: 140 },
} as const;

/** Focus rings, selection indicators — soft, no overshoot. */
export const SettleSpring = { friction: 9, tension: 140 } as const;

/**
 * How far a control travels under the finger, by size. Three values, no more:
 * a component picks the one matching what it *is*, it does not invent a
 * fourth. Eight components used to carry their own number (0.985, 0.97, 0.94,
 * 0.93, 0.88…), which is a difference nobody chose and everybody could feel.
 */
export const PressScale = {
  /** Large surfaces — cards, hero, list rows. */
  surface: 0.985,
  /** Medium controls — buttons, tiles, chips. */
  control: 0.97,
  /** Small controls — icon wells, calendar cells. */
  icon: 0.93,
} as const;

// ——— Entrance ———

/** Vertical travel (px) of an entering card. A hint, not a slide. */
export const EntranceTravel = 10;

/** Scale an entering card grows from. Barely perceptible by design. */
export const EntranceScale = 0.98;

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
