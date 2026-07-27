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

// ═══════════════════════════════════════════════════════════════════════════
// LIVING — the app's signature transition.
//
// Rondivo does not push screens over each other: a card GROWS into its own
// detail and shrinks back onto its exact place in the list. The tokens below
// are that language, and they are the only ones a living surface may use.
// See components/ui/living/README.md.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The physics of every living surface — a Reanimated `withSpring` config.
 *
 * Slightly under-damped, with an overshoot small enough that you cannot see
 * it and only feel that the surface has weight. A stiffer spring reads
 * mechanical; a bouncier one reads like a toy. `mass: 1` with this ratio
 * settles in ~380 ms without ever crossing its target by more than a hair.
 *
 * This is the ONE spring for expansion, collapse and gesture release, so a
 * card released from a drag finishes exactly like a card that was tapped.
 */
export const LivingSpring = {
  damping: 30,
  stiffness: 220,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.2,
  restSpeedThreshold: 2,
} as const;

/**
 * Where the two contents cross over, as fractions of the expansion.
 *
 * The windows OVERLAP on purpose (0.25 → 0.34): the detail is already
 * arriving while the summary is still leaving, so no frame of the transition
 * shows an empty surface and nothing "appears" once the movement has ended.
 * A gap here is what makes a transition read as two separate events.
 */
export const LivingContent = {
  /** The collapsed summary fades out over the first third. */
  summaryOut: [0, 0.34] as const,
  /** The detail fades in from a quarter of the way, done well before the end. */
  detailIn: [0.25, 0.82] as const,
  /** The page behind darkens across the whole movement. */
  scrimIn: [0, 1] as const,
} as const;

/**
 * Pull-to-close. The surface follows the finger 1:1 from the first pixel —
 * these only decide what happens when it is RELEASED.
 */
export const LivingDismiss = {
  /** Past this many points of travel, releasing closes. */
  distance: 110,
  /** …or past this velocity, however short the travel (a flick). */
  velocity: 900,
  /** How much the surface shrinks at full travel — depth, not a slide. */
  scaleAtLimit: 0.92,
  /** Travel over which that shrink is reached. */
  scaleTravel: 420,
} as const;

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
