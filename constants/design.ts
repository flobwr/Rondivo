/**
 * Design tokens for the Rondivo app — the Rondivo Design System foundation.
 *
 * Centralises every colour, spacing value, radius and font size so the UI stays
 * consistent and free of repeated "magic numbers".
 *
 * The identity in three decisions:
 *   1. PAPER, NOT SCREEN — the background is a warm paper white (`screen`),
 *      never pure white and never a cool grey. White cards float on it like
 *      sheets on a desk. Roughly 85–90% of any screen is paper + white.
 *   2. ONE BLUE — `blue` (#2553CC) is the single signature accent, an ink-like
 *      cobalt used sparingly: the primary CTA, active states, and small points
 *      of emphasis. It never floods a surface.
 *   3. INK, NOT GREY — text is warm ink on paper. Every text token clears
 *      WCAG AA (most clear 5:1) on both `screen` and `card`, because this app
 *      is read outdoors in direct sunlight.
 */

export const LightPalette = {
  // Surfaces
  screen: '#F7F6F2', // warm paper — the Rondivo background
  card: '#FFFFFF', // white cards float on the paper
  cardMuted: '#FBFAF7', // barely-off-white for secondary tiles

  // Text — warm ink family, tuned for outdoor readability
  textPrimary: '#1C1B18', // near-black warm ink (15.9:1 on screen)
  textSecondary: '#56524B', // muted warm slate (7.2:1 on screen)
  textTertiary: '#6B665E', // lightest ink that still clears 5:1 on screen/card
  white: '#FFFFFF',

  // Text/icon colour used ON the signature blue (CTA, avatar). White in light
  // mode; dark ink in dark mode where `blue` is a light tint.
  onAccent: '#FFFFFF',

  // Signature accent — "Bleu Rondivo", a deep cobalt ink. 6.6:1 on white as
  // text, and 6.6:1 under white text as a button fill.
  blue: '#2553CC',
  blueAvatar: '#2553CC', // same ink — one blue, everywhere
  blueSoft: '#EAEFFA', // light blue tile / pill background

  orange: '#F59E0B',
  orangeSoft: '#FBF0DC',
  // `orange` itself is ~2.1:1 on `orangeSoft` — fine as an icon/dot fill, not
  // as text. Status badges ("À relancer"...) use this darker ink instead.
  orangeInk: '#7A5620',

  purple: '#7C3AED',
  purpleSoft: '#EFEAFB',

  green: '#10B981',
  greenSoft: '#E5F4EC',
  // `green` itself is ~2.3:1 on `greenSoft` — fine as an icon/dot fill, not
  // as text. Status badges ("Payée", "Accepté"...) use this darker ink instead.
  greenInk: '#146C43',

  red: '#EF4444', // "erreur" accent (same value as `notification`)
  redSoft: '#FBECE9', // soft tile bg for the red accent — used by Documents "à traiter"
  // `red` itself is ~3.5:1 on `redSoft` — fine as an icon/dot fill, not as
  // text. Error text and status badges use this darker ink instead.
  redInk: '#B42318',
  // A less saturated red than `red` — for routine destructive actions
  // (logout, delete) that shouldn't compete visually with real error states.
  danger: '#D97570',

  teal: '#0D9488', // "en route" accent (Planning)
  tealSoft: '#DDF3EF',

  // In-progress card tint — softer than blueSoft so text keeps full contrast
  blueTint: '#F0F3FB',
  blueBorder: '#C7D3F0',

  // Legacy gradient pair — kept for the few non-Home surfaces still using a
  // gradient fill; both stops now live inside the signature cobalt family.
  gradientStart: '#3060D9',
  gradientEnd: '#2549B8',

  // Misc
  iconButtonBg: '#F0EEE8', // round icon-button fill (headers, modals) — warm
  border: '#ECE9E1', // hairline card border — just darker than the paper
  // ~18% lighter than `border` — used only for the Plus module's own hairline
  // row dividers, which want to guide the eye without ever drawing it.
  separator: 'rgba(236, 233, 225, 0.8)',
  shadow: '#26221A', // warm dark — shadows on paper read warm, never blue
  notification: '#EF4444',
  pillBlueBg: '#EAEFFA',
} as const;

/**
 * Dark counterpart of `LightPalette` — same keys, same relationships
 * (soft tints stay legible under their matching ink color, surfaces still
 * step screen -> card -> cardMuted), tuned for a dark background instead of
 * inverted 1:1. Surfaces are warm charcoal (the night version of paper),
 * never navy. Only wired up on a handful of "key" screens so far (see
 * `contexts/theme.tsx`); most of the app still reads the static `Palette`
 * export below and stays light regardless of this setting.
 */
export const DarkPalette: Record<keyof typeof LightPalette, string> = {
  screen: '#131210',
  card: '#1D1B18',
  cardMuted: '#232019',

  textPrimary: '#F5F4F0',
  textSecondary: '#C0BCB4',
  textTertiary: '#948F87',
  white: '#FFFFFF',

  // `blue` is a light tint here, so the ink ON it flips dark (7.0:1).
  onAccent: '#14130F',

  blue: '#7C9CF2',
  blueAvatar: '#5B82EA',
  blueSoft: '#20263B',

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
  redInk: '#F49B93',
  danger: '#E0918A',

  teal: '#2DD4BF',
  tealSoft: '#0F2E2B',

  blueTint: '#1B2133',
  blueBorder: '#324569',

  gradientStart: '#4C79E8',
  gradientEnd: '#2F55C4',

  iconButtonBg: '#242119',
  border: '#2A2721',
  separator: 'rgba(42, 39, 33, 0.8)',
  shadow: '#000000',
  notification: '#F87171',
  pillBlueBg: '#20263B',
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
    red: palette.redInk,
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
