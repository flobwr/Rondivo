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

export function getPalette(scheme: 'light' | 'dark'): PaletteShape {
  return scheme === 'dark' ? DarkPalette : LightPalette;
}

/** Static light palette — screens that haven't opted into dark mode. */
export const Palette = LightPalette;

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
