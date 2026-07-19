/**
 * Rondivo Design System — « Atelier » palette.
 *
 * Rebuilt from a blank page. Three commitments:
 *
 *   1. PAPER, EVERYWHERE — the app lives on a calm, faintly warm paper
 *      (`screen`). Cards are off-white sheets (`card`), never pure white:
 *      pure white (`float`) is *reserved* for the few things that truly
 *      float above the page (dock, sheets, FAB), so elevation reads as
 *      light before it reads as shadow.
 *   2. ONE INK — Bleu Rondivo (`blue`, #2447CF) is a writing ink, not a
 *      paint bucket. It marks the primary action, the active state, the
 *      thing your eye should land on first — and nothing else.
 *   3. SUNLIGHT CONTRAST — every text token clears WCAG AA (≥ 4.5:1) on
 *      the surfaces it is used on; body ink clears 15:1. This app is read
 *      one-handed, outdoors, at noon.
 */

import { bumpThemeGeneration } from './themed';

export const LightPalette = {
  // ——— Surfaces ———
  screen: '#F4F3F0', // the paper — calm, faintly warm, never white
  card: '#FDFCFA', // off-white sheet resting on the paper
  cardMuted: '#F7F6F3', // recessed tile inside a card
  float: '#FFFFFF', // reserved: floating chrome (dock, sheets, FAB)
  inset: '#ECEAE4', // pressed-into-the-paper fills: wells, tracks, skeletons
  insetDeep: '#E0DCD3', // one step deeper: sheet grab-handles, timeline rails, shimmer highlight

  // ——— Ink ———
  textPrimary: '#1B1A17', // 15.7:1 on screen
  textSecondary: '#57534B', // 6.9:1 on screen
  textTertiary: '#6F6A61', // 4.8:1 on screen, 5.2:1 on card
  white: '#FFFFFF',

  // Ink used ON the signature blue (buttons, avatar). Flips dark in dark
  // mode, where `blue` becomes a light tint.
  onAccent: '#FFFFFF',

  // ——— Bleu Rondivo — the one ink ———
  blue: '#2447CF', // 6.6:1 as text on screen, 7.3:1 under white text
  blueAvatar: '#2447CF',
  blueSoft: '#E9EDFB', // wash for pills/wells that carry blue ink
  blueTint: '#F1F3FC', // faint tint for "in progress" surfaces
  blueBorder: '#C3CDF2',

  // ——— Status duotones (ink on wash) ———
  // The vivid value is a dot/icon fill; the `…Ink` value is the ONLY one
  // allowed as text on the matching wash (all ≥ 5:1).
  green: '#22A06B',
  greenSoft: '#E3F0E7',
  greenInk: '#1F7A4D',

  orange: '#E8930C',
  orangeSoft: '#F6EBD9',
  orangeInk: '#8A5A18',

  red: '#DE3730',
  redSoft: '#F7E9E6',
  redInk: '#B3261E',
  // Softer red for routine destructive rows (logout, delete) that must not
  // shout like a real error state.
  danger: '#C25E58',

  purple: '#6134C8', // text-safe on its own wash (6.2:1)
  purpleSoft: '#EEE9FB',

  teal: '#0C6D62', // "en route" accent — text-safe on tealSoft
  tealSoft: '#DFF0ED',

  // Legacy gradient pair — the few remaining gradient fills stay inside the
  // signature ink family.
  gradientStart: '#3A63E8',
  gradientEnd: '#2041B8',

  // ——— Chrome ———
  dock: '#ECEAE4', // floating dock capsule — one tone below the paper, so the bar reads as chrome, not as a card
  iconButtonBg: '#EDEBE5', // circular icon-well fill (headers, modals)
  border: '#E8E5DE', // hairline sheet edge, just darker than the paper
  separator: 'rgba(27, 26, 23, 0.07)', // row dividers — alpha so they sit on any surface
  shadow: '#141210', // warm shadow ink — never a cold blue-grey
  notification: '#DE3730',
  pillBlueBg: '#E9EDFB',
} as const;

export type PaletteShape = Record<keyof typeof LightPalette, string>;

// ═══════════════════════════════════════════════════════════════════════════
// The five papers.
//
// A theme changes the AMBIANCE, never the system: same grid, same radii,
// same interactions, same brand ink. What actually moves:
//
//   · the paper's temperature (warm cream → icy blue → cool slate → deep
//     navy → true black)
//   · how much weight borders carry vs. shadows (crisp hairlines on the
//     cool papers, near-invisible shadow + a real edge on AMOLED)
//   · the accent blue's own tint where legibility demands it (dark papers
//     lighten Bleu Rondivo to a readable tint; light papers keep the exact
//     brand hex, so the identity never drifts)
//
// The three light papers spread from `LightPalette`, so Bleu Rondivo and
// every status duotone stay byte-identical across them — only the neutrals,
// the chrome and the shadow ink change. Midnight and AMOLED are written out
// in full: too much inverts to spread cleanly.
// ═══════════════════════════════════════════════════════════════════════════

/** Arctic — icy, minimal, the crispest paper. Cool near-white, pure-white sheets. */
export const ArcticPalette: PaletteShape = {
  ...LightPalette,
  screen: '#F1F6FA',
  card: '#FFFFFF',
  cardMuted: '#E9F1F7',
  float: '#FFFFFF',
  inset: '#E1EBF2',
  insetDeep: '#CFDFEA',

  textPrimary: '#0E1B26',
  textSecondary: '#4C6072',
  textTertiary: '#6C8194',

  dock: '#E5EEF4',
  iconButtonBg: '#E7EFF5',
  border: '#DCE7EF',
  separator: 'rgba(14, 27, 38, 0.07)',
  shadow: '#0A1620',
};

/** Slate — modern, technical cool grey. More contrast and visible structure than Arctic. */
export const SlatePalette: PaletteShape = {
  ...LightPalette,
  screen: '#E7E8EC',
  card: '#F7F7F9',
  cardMuted: '#EFEFF2',
  float: '#FFFFFF',
  inset: '#DEE0E5',
  insetDeep: '#CBCED6',

  textPrimary: '#15171B',
  textSecondary: '#4B4F58',
  textTertiary: '#686D78',

  dock: '#DEE0E5',
  iconButtonBg: '#E3E4E9',
  border: '#D2D5DC',
  separator: 'rgba(21, 23, 27, 0.09)',
  shadow: '#0C0D10',
};

/**
 * Midnight — deep navy dark paper. Same relationships as any light paper
 * (screen → card → float steps *up* in lightness), re-derived for a
 * blue-black instead of the warm charcoal Atelier would invert to.
 */
export const MidnightPalette: PaletteShape = {
  screen: '#0A0D16',
  card: '#141A29',
  cardMuted: '#1A2135',
  float: '#1D2438',
  inset: '#212A44',
  insetDeep: '#2B3554',

  textPrimary: '#F1F3FA',
  textSecondary: '#AEB4CC',
  textTertiary: '#7D85A4',
  white: '#FFFFFF',

  onAccent: '#0A0D16',

  blue: '#8CA6FA',
  blueAvatar: '#5B82EA',
  blueSoft: '#212B4A',
  blueTint: '#1A2338',
  blueBorder: '#37477E',

  green: '#4CC38A',
  greenSoft: '#122A22',
  greenInk: '#7BDDAF',

  orange: '#F2A33C',
  orangeSoft: '#332912',
  orangeInk: '#F5BC66',

  red: '#F27970',
  redSoft: '#33201D',
  redInk: '#F59E96',
  danger: '#DD8F88',

  purple: '#B79BF2',
  purpleSoft: '#271F3D',

  teal: '#3FC8B4',
  tealSoft: '#123430',

  gradientStart: '#4C79E8',
  gradientEnd: '#2F55C4',

  dock: '#151C2E',
  iconButtonBg: '#1B2338',
  border: '#2B3554',
  separator: 'rgba(241, 243, 250, 0.09)',
  shadow: '#010208',
  notification: '#F27970',
  pillBlueBg: '#212B4A',
};

/**
 * AMOLED — true black, battery-friendly. Shadows lose all meaning on pure
 * black (there's nothing darker to cast *onto*), so definition comes from a
 * visible hairline border instead — the one paper where a border carries
 * more weight than its shadow.
 */
export const AmoledPalette: PaletteShape = {
  screen: '#000000',
  card: '#0D0D0D',
  cardMuted: '#151515',
  float: '#121212',
  inset: '#1B1B1B',
  insetDeep: '#242424',

  textPrimary: '#FFFFFF',
  textSecondary: '#B6B6B6',
  textTertiary: '#8A8A8A',
  white: '#FFFFFF',

  onAccent: '#040404',

  blue: '#6D93FF',
  blueAvatar: '#4C79E8',
  blueSoft: '#182036',
  blueTint: '#12182B',
  blueBorder: '#33427A',

  green: '#57D69A',
  greenSoft: '#0F2019',
  greenInk: '#7BE6AE',

  orange: '#FFAE4A',
  orangeSoft: '#2B2110',
  orangeInk: '#FFC876',

  red: '#FF8478',
  redSoft: '#2B1714',
  redInk: '#FFA398',
  danger: '#E2948C',

  purple: '#C4A8FF',
  purpleSoft: '#201936',

  teal: '#4FDCC4',
  tealSoft: '#0D2925',

  gradientStart: '#5B85F2',
  gradientEnd: '#3560D0',

  dock: '#0A0A0A',
  iconButtonBg: '#171717',
  border: 'rgba(255, 255, 255, 0.14)',
  separator: 'rgba(255, 255, 255, 0.10)',
  shadow: '#000000',
  notification: '#FF8478',
  pillBlueBg: '#182036',
};

/** Kept as the historical name for Midnight — a few call sites still import it directly. */
export const DarkPalette = MidnightPalette;

export type ThemeName = 'atelier' | 'arctic' | 'slate' | 'midnight' | 'amoled';

export const THEME_ORDER: ThemeName[] = ['atelier', 'arctic', 'slate', 'midnight', 'amoled'];

export const THEMES: Record<
  ThemeName,
  { label: string; tagline: string; scheme: 'light' | 'dark'; palette: PaletteShape }
> = {
  atelier: {
    label: 'Atelier',
    tagline: 'Papier crème, l’original',
    scheme: 'light',
    palette: LightPalette,
  },
  arctic: {
    label: 'Arctic',
    tagline: 'Blanc glacé, minimal',
    scheme: 'light',
    palette: ArcticPalette,
  },
  slate: {
    label: 'Slate',
    tagline: 'Gris ardoise, technique',
    scheme: 'light',
    palette: SlatePalette,
  },
  midnight: {
    label: 'Midnight',
    tagline: 'Bleu nuit profond',
    scheme: 'dark',
    palette: MidnightPalette,
  },
  amoled: {
    label: 'AMOLED',
    tagline: 'Noir pur, économe',
    scheme: 'dark',
    palette: AmoledPalette,
  },
};

export function getPalette(scheme: 'light' | 'dark'): PaletteShape {
  return scheme === 'dark' ? MidnightPalette : LightPalette;
}

/**
 * The ACTIVE palette — a live object, mutated in place when the theme
 * changes. Screens that read `Palette.x` at render time follow the theme
 * automatically; module-scope styles follow through `createThemedStyles`
 * (see `theme/themed.ts`). Starts on Atelier, the default paper.
 */
export const Palette: PaletteShape = { ...LightPalette };

/** Swap the active paper. Called by the ThemeProvider only. */
export function setActivePalette(next: PaletteShape) {
  Object.assign(Palette, next);
  Object.assign(StatusInk, getStatusInk(next));
  bumpThemeGeneration();
}

/**
 * The one place to look up an accent's TEXT-safe colour. The vivid accents
 * (`green`, `orange`, `red`) are icon/dot fills and fail AA as text on their
 * own wash — status text must come from here.
 */
export function getStatusInk(
  palette: PaletteShape
): Record<'red' | 'orange' | 'green' | 'blue' | 'purple', string> {
  return {
    red: palette.redInk,
    orange: palette.orangeInk,
    green: palette.greenInk,
    blue: palette.blue,
    purple: palette.purple,
  };
}

export const StatusInk = getStatusInk(LightPalette);
