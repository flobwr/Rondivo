/**
 * Motion tokens for Rondivo.
 *
 * The app has one, very deliberate, motion personality: quick spring-based
 * press feedback, gentle staggered entrances, calm shimmer loops. Today those
 * numbers are copy-pasted into ~10 components with tiny, accidental variations
 * (press scale is 0.98 here, 0.978 there, 0.95, 0.92, 0.9, 0.86…). These tokens
 * capture the intended values once so every primitive feels the same.
 *
 * Consumed by the shared hooks (use-press-scale, use-entrance, use-shimmer) and
 * by the design-system primitives. See ARCHITECTURE_RULES.md § Motion.
 */

/** Spring configs for react-native Animated.spring. */
export const Spring = {
  /** Press-in: firm, snappy grab. */
  pressIn: { friction: 6, tension: 300 },
  /** Press-out: softer release/settle. */
  pressOut: { friction: 4, tension: 120 },
  /** Entrance: gentle glide for cards appearing on screen. */
  entrance: { friction: 9, tension: 80 },
  /** Selection: bubble/pill sliding between states. */
  selection: { friction: 8, tension: 140 },
} as const;

/**
 * Press scale targets by control size. Small controls (icon buttons) travel a
 * little further than large surfaces (cards) so the feedback reads at any size.
 */
export const PressScale = {
  /** Large surfaces — cards, hero. */
  surface: 0.98,
  /** Medium controls — buttons, list items. */
  control: 0.96,
  /** Small controls — icon buttons, chips. */
  icon: 0.92,
} as const;

/** Animation durations (ms) for timing-based transitions. */
export const Duration = {
  fast: 180,
  base: 260,
  slow: 320,
  shimmer: 920,
} as const;

/** Per-item stagger delay (ms) for list entrance animations. */
export const StaggerDelay = 45;

/** Shimmer gradient endpoints for skeleton loaders. */
export const ShimmerColors = {
  from: '#E8ECF2',
  to: '#D6DCE6',
} as const;
