/**
 * Design tokens for the Rondivo app.
 *
 * Centralises every colour, spacing value, radius and font size so the UI stays
 * consistent and free of repeated "magic numbers". The values below are tuned to
 * reproduce the reference mockup as closely as possible.
 */

export const Palette = {
  // Surfaces
  screen: '#F6F7F9', // off-white app background
  card: '#FFFFFF', // white cards (reminders, appointment)
  cardMuted: '#FAFBFC', // very light grey for the 4 quick-action cards

  // Text
  textPrimary: '#0F1729', // near-black headings
  textSecondary: '#6B7280', // muted grey labels
  textTertiary: '#9AA3AF', // lightest grey (addresses, sub labels)
  white: '#FFFFFF',

  // Accents
  blue: '#2563EB', // primary accent / badges
  blueAvatar: '#2F6BF0', // avatar circle
  blueSoft: '#EAF1FE', // light blue tile / pill background

  orange: '#F59E0B',
  orangeSoft: '#FEF1DC',

  purple: '#7C3AED',
  purpleSoft: '#EDE7FE',

  green: '#10B981',
  greenSoft: '#E4F6EE',

  // Hero gradient (blue -> turquoise)
  gradientStart: '#3B7DF0',
  gradientEnd: '#3FC9B0',

  // Misc
  border: '#EEF0F3',
  shadow: '#0F1729',
  notification: '#EF4444',
  pillBlueBg: '#EAF1FE',
} as const;

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
