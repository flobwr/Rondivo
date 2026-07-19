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
    whisper: { boxShadow: `0 1px 3px rgba(${ink}, 0.06), 0 4px 10px rgba(${ink}, 0.04)` },
    /** Standard sheet/card resting on the paper. */
    card: { boxShadow: `0 1px 3px rgba(${ink}, 0.04), 0 8px 24px rgba(${ink}, 0.07)` },
    /** The screen's one dominant card. */
    raised: { boxShadow: `0 3px 6px rgba(${ink}, 0.05), 0 20px 48px rgba(${ink}, 0.10)` },
    /** Floating chrome: dock, FAB, sheets, popovers, modals. */
    float: { boxShadow: `0 3px 8px rgba(${ink}, 0.08), 0 24px 56px rgba(${ink}, 0.16)` },
    none: {} as ViewStyle,
  };
}

function darkSet(opacityScale: number): ElevationSet {
  // Shadows carry less information on a dark surface — the lift is scaled
  // up front-to-back but leans on the hairline border (added at the call
  // site) for the definition a light shadow can't provide here.
  return {
    whisper: { boxShadow: `0 1px 3px rgba(0, 0, 0, ${0.32 * opacityScale})` },
    card: { boxShadow: `0 2px 10px rgba(0, 0, 0, ${0.38 * opacityScale})` },
    raised: { boxShadow: `0 8px 28px rgba(0, 0, 0, ${0.46 * opacityScale})` },
    float: { boxShadow: `0 10px 36px rgba(0, 0, 0, ${0.54 * opacityScale})` },
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
