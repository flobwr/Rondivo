import type { ViewStyle } from 'react-native';

import type { ThemeName } from './palette';

/**
 * Rondivo elevation — real light, not "Android elevation".
 *
 * Every shadow is TWO layers via the `boxShadow` style (RN ≥ 0.76, new
 * architecture — identical rendering on iOS and Android):
 *
 *   · a tight CONTACT shadow (the card touches the paper)
 *   · a wide, soft AMBIENT shadow (the card floats above it)
 *
 * Four tiers, one vocabulary, used identically everywhere something lifts
 * off the page — cards, buttons, the floating dock, FABs, menus, overlays,
 * modals:
 *
 *   whisper → card → raised → float
 *
 * Each PAPER tunes its own shadow ink and, where a shadow can't do the job
 * (AMOLED's true black has nothing darker to cast onto), leans on a
 * matching hairline border instead — wired in `Card`, `BottomDock` and
 * anywhere else that checks `scheme === 'dark'`.
 */

type ElevationSet = {
  whisper: ViewStyle;
  card: ViewStyle;
  raised: ViewStyle;
  float: ViewStyle;
  none: ViewStyle;
};

function lightSet(ink: string): ElevationSet {
  return {
    /** Chips, badges, icon wells, quick-action buttons — a breath of lift. */
    whisper: { boxShadow: `0 1px 3px rgba(${ink}, 0.07), 0 4px 11px rgba(${ink}, 0.05)` },
    /** Standard sheet/card resting on the paper. */
    card: { boxShadow: `0 2px 4px rgba(${ink}, 0.05), 0 10px 26px rgba(${ink}, 0.09)` },
    /** The screen's one dominant card. */
    raised: { boxShadow: `0 4px 8px rgba(${ink}, 0.06), 0 22px 52px rgba(${ink}, 0.13)` },
    /** Floating chrome: dock, FAB, sheets, popovers, modals. */
    float: { boxShadow: `0 4px 10px rgba(${ink}, 0.10), 0 26px 60px rgba(${ink}, 0.20)` },
    none: {} as ViewStyle,
  };
}

function darkSet(opacityScale: number): ElevationSet {
  // Shadows carry less information on a dark surface — the lift is scaled
  // up front-to-back but leans on the hairline border (added at the call
  // site) for the definition a light shadow can't provide here.
  return {
    whisper: { boxShadow: `0 1px 3px rgba(0, 0, 0, ${0.36 * opacityScale})` },
    card: { boxShadow: `0 2px 11px rgba(0, 0, 0, ${0.42 * opacityScale})` },
    raised: { boxShadow: `0 9px 30px rgba(0, 0, 0, ${0.50 * opacityScale})` },
    float: { boxShadow: `0 11px 38px rgba(0, 0, 0, ${0.58 * opacityScale})` },
    none: {} as ViewStyle,
  };
}

const SETS: Record<ThemeName, ElevationSet> = {
  atelier: lightSet('20, 18, 16'), // warm shadow ink — never a cold blue-grey
  arctic: lightSet('10, 22, 32'), // cool, icy ink
  slate: lightSet('12, 13, 16'), // cool graphite ink
  midnight: darkSet(1), // full-strength dark lift
  // True black has nothing darker to cast a shadow onto — the shadow is
  // nearly inert by design; `border` (rgba white) does the actual work.
  amoled: darkSet(1.3),
};

export function getElevation(theme: ThemeName): ElevationSet {
  return SETS[theme];
}

/**
 * The one shadow that is blue-tinted rather than the neutral paper ink —
 * reserved for the handful of surfaces that ARE Bleu Rondivo (the active
 * intervention card, the add-intervention FAB, the selected calendar day):
 * the glow reads as the ink casting its own light, not paper lifting off
 * paper. Not part of the theme-aware `ElevationSet` on purpose — it is the
 * same brand ink regardless of paper.
 */
export const glowShadow: ViewStyle = {
  boxShadow: '0 4px 12px rgba(36, 71, 207, 0.20), 0 16px 36px rgba(36, 71, 207, 0.26)',
};

/** Default export — Atelier's tiers, for the handful of call sites that
 *  haven't opted into `getElevation(theme)` yet. */
export const Elevation = SETS.atelier;

// ——— Named elevations used across screens (legacy call sites) ———
// One vocabulary, four levels — these aliases keep 60+ existing call sites
// on the new system without a mechanical rename of every screen.
export const heroShadow: ViewStyle = Elevation.raised;
export const cardShadow: ViewStyle = Elevation.card;
export const actionShadow: ViewStyle = Elevation.whisper;
export const badgeShadow: ViewStyle = Elevation.whisper;
export const iconButtonShadow: ViewStyle = Elevation.whisper;
export const floatingButtonShadow: ViewStyle = Elevation.float;
