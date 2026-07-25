/**
 * Motion tokens for Rondivo — the app's single movement identity.
 *
 * Rondivo has ONE way of moving. Two mechanisms, each with a clear job:
 *
 *   • Springs  → touch. Anything the finger drives (press feedback, a bubble
 *                following a selection). A spring has no duration; it has a
 *                feel, and that feel is the app's tactile signature.
 *   • Curves   → transitions. Anything the app decides to change on its own
 *                (a card appearing, a colour crossfading, a sheet sliding up).
 *                Fixed durations, fixed easings, one per interaction *type*.
 *
 * The durations below are the contract. A micro-interaction is 180 ms
 * everywhere in the app — never 150 here and 200 there. If a new animation
 * doesn't fit one of these four buckets, the animation is probably wrong, not
 * the token.
 *
 * Consumed by the shared hooks (use-press-scale, use-entrance, use-fade,
 * use-shimmer) and by the design-system primitives.
 * See ARCHITECTURE_RULES.md § Motion.
 */

import { Easing, type EasingFunction } from 'react-native';

// ── Easing ────────────────────────────────────────────────────────────────────

/**
 * The three easing curves of Rondivo. There are no others.
 *
 * `enter` is the signature curve: it starts quickly and settles over a long,
 * calm tail, so movement is perceived as fluid rather than as "an animation".
 */
export const Curve = {
  /** Something changing in place — colour, opacity, selection, crossfades. */
  standard: Easing.bezier(0.4, 0, 0.2, 1),
  /** Something arriving — cards, screens, sheets. Decelerates into place. */
  enter: Easing.bezier(0.22, 0.9, 0.24, 1),
  /** Something leaving. Accelerates away, never lingers. */
  exit: Easing.bezier(0.4, 0, 1, 1),
} as const;

// ── Durations ─────────────────────────────────────────────────────────────────

/**
 * Animation durations (ms), named by interaction type — never by speed.
 * A component asks for "a card animation", not for "220 ms".
 */
export const Duration = {
  /** Micro-interactions: tab crossfade, badge/colour changes, small states. */
  micro: 180,
  /** Cards: entrances, list staggers, expand/collapse. */
  card: 220,
  /** Navigation: screen content appearing, section swaps. */
  navigation: 280,
  /** Overlays: modals, bottom sheets. */
  overlay: 300,
  /** Skeleton shimmer half-period (loop, not a transition). */
  shimmer: 920,
} as const;

export type TimingToken = { duration: number; easing: EasingFunction };

/**
 * Ready-to-spread `Animated.timing` configs. Pairing each duration with its
 * curve *here* is what guarantees a card never animates with the micro curve by
 * accident.
 *
 * @example Animated.timing(v, { toValue: 1, useNativeDriver: true, ...Timing.card })
 */
export const Timing = {
  micro: { duration: Duration.micro, easing: Curve.standard },
  card: { duration: Duration.card, easing: Curve.enter },
  navigation: { duration: Duration.navigation, easing: Curve.enter },
  overlay: { duration: Duration.overlay, easing: Curve.enter },
} as const satisfies Record<string, TimingToken>;

// ── Springs (touch only) ──────────────────────────────────────────────────────

/** Spring configs for react-native `Animated.spring`. */
export const Spring = {
  /** Press-in: firm, snappy grab. */
  pressIn: { friction: 6, tension: 300 },
  /** Press-out: softer release/settle. */
  pressOut: { friction: 4, tension: 120 },
  /** Selection: a bubble/pill gliding between states under the finger. */
  selection: { friction: 8, tension: 140 },
} as const;

/**
 * Press scale targets by control size. Small controls travel a little further
 * than large surfaces so the feedback reads at any size. Three values, no more:
 * a component picks the one matching what it *is*, it does not invent a fourth.
 */
export const PressScale = {
  /** Large surfaces — cards, hero. */
  surface: 0.98,
  /** Medium controls — buttons, list items, tiles. */
  control: 0.96,
  /** Small controls — icon buttons, chips, calendar cells. */
  icon: 0.92,
} as const;

// ── Entrance ──────────────────────────────────────────────────────────────────

/** Per-item stagger delay (ms) for list entrance animations. */
export const StaggerDelay = 45;

/** Vertical travel (px) of an entering card. Small on purpose — a hint, not a slide. */
export const EntranceTravel = 10;

/** Scale an entering card grows from. Barely perceptible by design. */
export const EntranceScale = 0.98;

// ── Shimmer ───────────────────────────────────────────────────────────────────

/**
 * Shimmer gradient endpoints for skeleton loaders. One pulse for the whole app:
 * a loading Home and a loading Planning must breathe at the same rate.
 */
export const ShimmerColors = {
  from: '#E8ECF2',
  to: '#D6DCE6',
} as const;
