import type { ViewStyle } from 'react-native';

/**
 * Rondivo elevation — real light, not "Android elevation".
 *
 * Every shadow is TWO layers via the `boxShadow` style (RN ≥ 0.76, new
 * architecture — identical rendering on iOS and Android):
 *
 *   · a tight, faint CONTACT shadow (the card touches the paper)
 *   · a wide, very soft AMBIENT shadow (the card floats above it)
 *
 * All layers share one warm shadow ink (#141210) at single-digit opacities,
 * so cards read as sheets lifted off a desk — never as outlined boxes.
 */

const INK = '20, 18, 16'; // warm shadow ink, rgb of #141210

export const Elevation = {
  /** Chips, badges, icon wells — a breath of separation. */
  whisper: {
    boxShadow: `0 1px 3px rgba(${INK}, 0.05)`,
  },
  /** Standard sheet/card resting on the paper. */
  card: {
    boxShadow: `0 1px 2px rgba(${INK}, 0.03), 0 6px 20px rgba(${INK}, 0.05)`,
  },
  /** The screen's one dominant card. */
  raised: {
    boxShadow: `0 2px 4px rgba(${INK}, 0.04), 0 16px 40px rgba(${INK}, 0.08)`,
  },
  /** Floating chrome: dock, FAB, sheets, popovers. */
  float: {
    boxShadow: `0 2px 6px rgba(${INK}, 0.07), 0 20px 48px rgba(${INK}, 0.14)`,
  },
  none: {} as ViewStyle,
} as const;

/**
 * Dark scheme: shadows lose meaning on near-black paper, so floating chrome
 * relies on its lighter `float` surface; only a hint of black grounding
 * remains.
 */
export function getElevation(scheme: 'light' | 'dark') {
  if (scheme === 'light') return Elevation;
  return {
    whisper: { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' },
    card: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)' },
    raised: { boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35)' },
    float: { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)' },
    none: {} as ViewStyle,
  } as const;
}

// ——— Named elevations used across screens (legacy call sites) ———
// One vocabulary, four levels — these aliases keep 60+ existing call sites
// on the new system without a mechanical rename of every screen.
export const heroShadow: ViewStyle = Elevation.raised;
export const cardShadow: ViewStyle = Elevation.card;
export const actionShadow: ViewStyle = Elevation.whisper;
export const badgeShadow: ViewStyle = Elevation.whisper;
export const iconButtonShadow: ViewStyle = Elevation.whisper;
export const floatingButtonShadow: ViewStyle = Elevation.float;
