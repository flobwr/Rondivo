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

/**
 * Night paper — same relationships as the light palette (screen → card →
 * float still steps *up* in lightness, washes still carry their matching
 * ink at ≥ 4.5:1), re-derived for warm charcoal instead of inverted.
 */
export const DarkPalette: PaletteShape = {
  screen: '#141311',
  card: '#1E1C19',
  cardMuted: '#242219',
  float: '#262420',
  inset: '#2A2823',
  insetDeep: '#343128',

  textPrimary: '#F3F2EE',
  textSecondary: '#B9B5AC',
  textTertiary: '#918D84',
  white: '#FFFFFF',

  onAccent: '#10131C',

  blue: '#8FA8F5',
  blueAvatar: '#5B82EA',
  blueSoft: '#222941',
  blueTint: '#1C2233',
  blueBorder: '#35476E',

  green: '#4CC38A',
  greenSoft: '#12291E',
  greenInk: '#77D9A8',

  orange: '#F2A33C',
  orangeSoft: '#332912',
  orangeInk: '#F5BC66',

  red: '#F27970',
  redSoft: '#331B18',
  redInk: '#F59E96',
  danger: '#DD8F88',

  purple: '#B79BF2',
  purpleSoft: '#261D3B',

  teal: '#3FC8B4',
  tealSoft: '#10302C',

  gradientStart: '#4C79E8',
  gradientEnd: '#2F55C4',

  dock: '#2A2823',
  iconButtonBg: '#282520',
  border: '#2C2924',
  separator: 'rgba(243, 242, 238, 0.08)',
  shadow: '#000000',
  notification: '#F27970',
  pillBlueBg: '#222941',
};

// ═══════════════════════════════════════════════════════════════════════════
// Papers — the five Rondivo themes.
//
// A theme changes the PAPER, never the system: same grid, same radii, same
// shadows, same single ink. Only the surfaces, the greys and the chrome move.
// The four light papers share every status duotone and the signature blue, so
// switching theme never re-teaches the interface.
// ═══════════════════════════════════════════════════════════════════════════

/** Neige — pure white, the most minimal paper. Cool, near-neutral greys. */
export const NeigePalette: PaletteShape = {
  ...LightPalette,
  screen: '#FFFFFF',
  card: '#FFFFFF',
  cardMuted: '#F6F6F8',
  float: '#FFFFFF',
  inset: '#F1F1F4',
  insetDeep: '#E4E4E9',

  textPrimary: '#161719',
  textSecondary: '#54565C',
  textTertiary: '#6D7077',

  blueSoft: '#EAEEFB',
  blueTint: '#F2F4FD',
  blueBorder: '#C6CFF3',

  dock: '#F2F2F5',
  iconButtonBg: '#F1F1F4',
  border: '#ECECEF',
  separator: 'rgba(22, 23, 25, 0.06)',
  shadow: '#101114',
  pillBlueBg: '#EAEEFB',
};

/** Ardoise — modern slate grey, cooler and a touch more technical. */
export const ArdoisePalette: PaletteShape = {
  ...LightPalette,
  screen: '#EEEFF2',
  card: '#FBFBFC',
  cardMuted: '#F4F5F7',
  float: '#FFFFFF',
  inset: '#E4E5E9',
  insetDeep: '#D6D8DE',

  textPrimary: '#17191C',
  textSecondary: '#52565F',
  textTertiary: '#6A6E77',

  blueSoft: '#E7EBFA',
  blueTint: '#EFF2FC',
  blueBorder: '#C2CCF1',

  dock: '#E4E5E9',
  iconButtonBg: '#E7E8EC',
  border: '#E1E3E7',
  separator: 'rgba(23, 25, 28, 0.07)',
  shadow: '#0F1115',
  pillBlueBg: '#E7EBFA',
};

/** Sable — warm premium paper, one sunbeam warmer than Atelier. */
export const SablePalette: PaletteShape = {
  ...LightPalette,
  screen: '#F4EFE5',
  card: '#FDFBF6',
  cardMuted: '#F7F3EA',
  float: '#FFFFFF',
  inset: '#EBE3D3',
  insetDeep: '#DFD5C0',

  textPrimary: '#221D14',
  textSecondary: '#5C5546',
  textTertiary: '#716A59',

  dock: '#EBE3D3',
  iconButtonBg: '#EDE6D8',
  border: '#E9E1D0',
  separator: 'rgba(34, 29, 20, 0.08)',
  shadow: '#191408',
};

export type ThemeName = 'atelier' | 'neige' | 'ardoise' | 'sable' | 'nuit';

export const THEME_ORDER: ThemeName[] = ['atelier', 'neige', 'ardoise', 'sable', 'nuit'];

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
  neige: {
    label: 'Neige',
    tagline: 'Blanc pur, minimal',
    scheme: 'light',
    palette: NeigePalette,
  },
  ardoise: {
    label: 'Ardoise',
    tagline: 'Gris moderne',
    scheme: 'light',
    palette: ArdoisePalette,
  },
  sable: {
    label: 'Sable',
    tagline: 'Papier chaud',
    scheme: 'light',
    palette: SablePalette,
  },
  nuit: {
    label: 'Nuit',
    tagline: 'Papier de nuit',
    scheme: 'dark',
    palette: DarkPalette,
  },
};

export function getPalette(scheme: 'light' | 'dark'): PaletteShape {
  return scheme === 'dark' ? DarkPalette : LightPalette;
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
