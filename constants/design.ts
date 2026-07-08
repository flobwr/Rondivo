/**
 * Design tokens for the Rondivo app.
 *
 * Centralises every colour, spacing value, radius and font size so the UI stays
 * consistent and free of repeated "magic numbers". The values below are tuned to
 * reproduce the reference mockup as closely as possible.
 */

export const LightPalette = {
  // Surfaces
  screen: '#F7F8FC', // off-white app background — just warm enough for cards to pop
  card: '#FFFFFF', // white cards (reminders, appointment)
  cardMuted: '#FAFBFC', // very light grey for the 4 quick-action cards

  // Text
  // Both grey tokens are tuned to clear WCAG AA (4.5:1) against `screen` and
  // `card` — this app is read outdoors in direct sunlight, so anything lighter
  // reads as invisible rather than "elegant". textTertiary keeps a hair of
  // headroom above textSecondary for hierarchy, not for looking washed out.
  textPrimary: '#0F1729', // near-black headings
  textSecondary: '#4B5563', // muted slate — ~7:1 on screen/card
  textTertiary: '#6B7280', // lightest grey that still clears 4.5:1 on screen/card
  white: '#FFFFFF',

  // Accents
  blue: '#2563EB', // primary accent / badges
  blueAvatar: '#2F6BF0', // avatar circle
  blueSoft: '#EAF1FE', // light blue tile / pill background

  orange: '#F59E0B',
  orangeSoft: '#FEF1DC',
  // `orange` itself is ~2.1:1 on `orangeSoft` — fine as an icon/dot fill, not
  // as text. Status badges ("À relancer"...) use this darker ink instead.
  orangeInk: '#7A5620',

  purple: '#7C3AED',
  purpleSoft: '#EDE7FE',

  green: '#10B981',
  greenSoft: '#E4F6EE',
  // `green` itself is ~2.3:1 on `greenSoft` — fine as an icon/dot fill, not
  // as text. Status badges ("Payée", "Accepté"...) use this darker ink instead.
  greenInk: '#146C43',

  red: '#EF4444', // "erreur" accent (same value as `notification`)
  redSoft: '#FDEAEA', // soft tile bg for the red accent — used by Documents "à traiter"
  // A less saturated red than `red` — for routine destructive actions
  // (logout, delete) that shouldn't compete visually with real error states.
  danger: '#D97570',

  // Hero gradient (blue -> turquoise)
  gradientStart: '#3B7DF0',
  gradientEnd: '#3FC9B0',

  // Misc
  iconButtonBg: '#ECEEF2', // round icon-button fill (headers, modals)
  border: '#EEF0F3',
  // ~18% lighter than `border` — used only for the Plus module's own hairline
  // row dividers, which want to guide the eye without ever drawing it.
  separator: 'rgba(238, 240, 243, 0.8)',
  shadow: '#0F1729',
  notification: '#EF4444',
  pillBlueBg: '#EAF1FE',
} as const;

/**
 * Dark counterpart of `LightPalette` — same keys, same relationships
 * (soft tints stay legible under their matching ink color, surfaces still
 * step screen -> card -> cardMuted), tuned for a dark background instead of
 * inverted 1:1. Only wired up on a handful of "key" screens so far (see
 * `contexts/theme.tsx`); most of the app still reads the static `Palette`
 * export below and stays light regardless of this setting.
 */
export const DarkPalette: Record<keyof typeof LightPalette, string> = {
  screen: '#0B0F17',
  card: '#161D2A',
  cardMuted: '#1B2330',

  textPrimary: '#F3F5F9',
  textSecondary: '#B7BFCC',
  textTertiary: '#8B94A5',
  white: '#FFFFFF',

  blue: '#5B93F5',
  blueAvatar: '#4C86F0',
  blueSoft: '#1E2A44',

  orange: '#F5A623',
  orangeSoft: '#332912',
  // Text-safe tone flips direction vs. light mode: on a dark `orangeSoft`,
  // the accessible version of `orange` is lighter, not darker.
  orangeInk: '#F5B85C',

  purple: '#A47CF7',
  purpleSoft: '#241B38',

  green: '#34D399',
  greenSoft: '#0F2A20',
  greenInk: '#6EE7B7',

  red: '#F87171',
  redSoft: '#331A1A',
  danger: '#E0918A',

  gradientStart: '#4C86F0',
  gradientEnd: '#3FC9B0',

  iconButtonBg: '#1E2531',
  border: '#232B38',
  separator: 'rgba(35, 43, 56, 0.8)',
  shadow: '#000000',
  notification: '#F87171',
  pillBlueBg: '#1E2A44',
};

export type PaletteShape = Record<keyof typeof LightPalette, string>;

export function getPalette(scheme: 'light' | 'dark'): PaletteShape {
  return scheme === 'dark' ? DarkPalette : LightPalette;
}

export const Palette = LightPalette;

/**
 * The one place to look up an accent's TEXT-safe color. `Palette.orange` and
 * `Palette.green` are tuned as icon/dot fills (~2:1 on their own soft
 * background) and fail WCAG AA when rendered as text — a bug found and fixed
 * across `components/clients/types.ts` (status badges + avatar initials).
 * Any new status/tone UI should read the accent's text color from here
 * instead of reaching into `Palette` directly, so that mistake can't recur.
 */
export function getStatusInk(palette: PaletteShape): Record<'red' | 'orange' | 'green' | 'blue' | 'purple', string> {
  return {
    red: palette.red,
    orange: palette.orangeInk,
    green: palette.greenInk,
    blue: palette.blue,
    purple: palette.purple,
  };
}

export const StatusInk = getStatusInk(LightPalette);

export const Spacing = {
  screen: 24, // general horizontal margin
  section: 24, // vertical gap between sections
  sectionGap: 11, // compact vertical gap between large sections
  cardGap: 14, // gap between the 4 quick-action cards
  cardPadding: 20, // internal padding of cards
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const Radius = {
  hero: 28,
  card: 24,
  tile: 16,
  pill: 999,
} as const;

export const FontSize = {
  hero: 32, // big client name on hero card
  title: 22, // user name
  section: 18, // section titles
  cardLabel: 15, // labels of the 4 cards
  body: 16,
  label: 14,
  small: 13,
  tiny: 12,
} as const;
