/**
 * Design tokens for the Rondivo app.
 *
 * Centralises every colour, spacing value, radius and font size so the UI stays
 * consistent and free of repeated "magic numbers". The values below are tuned to
 * reproduce the reference mockup as closely as possible.
 */

import type { TextStyle } from 'react-native';

export const Palette = {
  // Surfaces
  screen: '#F7F8FC', // off-white app background — just warm enough for cards to pop
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

// ─────────────────────────────────────────────────────────────────────────────
// EXTENDED TOKENS
//
// Everything below is *additive*. It never changes an existing value, so no
// screen can shift visually. These tokens exist so that the design-system
// primitives (components/ui) — and any new screen — can be built without a
// single hard-coded font weight, letter-spacing, opacity or accent colour.
//
// Rule of thumb: if you are about to type a number or a hex string inside a
// StyleSheet, look here first. See ARCHITECTURE_RULES.md § Styling.
// ─────────────────────────────────────────────────────────────────────────────

/** Font weights, named. Use these instead of raw '400' / '700' strings. */
export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const satisfies Record<string, TextStyle['fontWeight']>;

/**
 * Letter-spacing scale. The Rondivo type ramp uses slightly negative tracking
 * on large/bold text and positive tracking on uppercase eyebrows — these are
 * the exact values already in use across the app, just named.
 */
export const LetterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  snug: -0.3,
  cozy: -0.2,
  slight: -0.1,
  none: 0,
  wide: 0.3,
  wider: 0.8,
  eyebrow: 1.0,
  overline: 1.4,
} as const;

/** Opacity steps used for muted / overlay / disabled treatments. */
export const Opacity = {
  disabled: 0.4,
  muted: 0.55,
  soft: 0.66,
  strong: 0.75,
  overlay: 0.2, // translucent white pills on the hero gradient
  scrim: 0.35, // modal / bottom-sheet backdrop
  full: 1,
} as const;

/**
 * Composite colours that can't be expressed as a flat Palette entry.
 * `scrim` is the modal / bottom-sheet backdrop (Palette.shadow @ Opacity.scrim).
 * `controlNeutral` is the grey behind neutral icon buttons (header bell/settings).
 */
export const Overlay = {
  scrim: 'rgba(15, 23, 41, 0.35)',
  /** White hairline divider over a coloured surface (hero card). */
  whiteDivider: 'rgba(255,255,255,0.30)',
  /** Translucent white pill/button over a coloured surface (hero empty CTA). */
  whitePill: 'rgba(255,255,255,0.20)',
  /** Fully transparent brand blue — start of the calendar bubble crossfade. */
  blueTransparent: 'rgba(37, 99, 235, 0)',
  /** Neutral-black shadow colour for the floating hero GPS button. */
  gpsShadow: '#000',
} as const;

export const ControlColor = {
  /** Neutral round-button background (Home header bell/settings). */
  neutralBg: '#ECEEF2',
  /** Neutral back-button background (Rappels header) — a hair lighter. */
  neutralBgAlt: '#EFF1F4',
  /** Quick-action tile hairline border. */
  tileBorder: '#E4E8EF',
} as const;

/**
 * Brand colours that intentionally differ from the semantic Palette.
 * `tabActive` is the active bottom-tab blue — deeper than Palette.blue by
 * design; kept as its own token so it isn't accidentally "unified" away.
 */
export const BrandColor = {
  tabActive: '#1A50E2',
} as const;

/**
 * Multi-stop gradients (arrays consumed by expo-linear-gradient). The primary
 * hero gradient lives in Palette (gradientStart/End); this holds the muted
 * empty-state variant.
 */
export const Gradient = {
  heroEmpty: ['#C2CBD8', '#B8C4D2'],
} as const;

/** Border widths. `hairline` is resolved by primitives via StyleSheet.hairlineWidth. */
export const BorderWidth = {
  hairline: 0.5,
  thin: 1,
  regular: 1.5,
} as const;

/** Standard touch-target expansion for small pressables. */
export const HitSlop = {
  sm: 6,
  md: 8,
  lg: 12,
} as const;

/**
 * Icon sizing scale. Icons in the app cluster around a handful of sizes; naming
 * them keeps AppIconButton / AppIconTile / AppListItem visually consistent.
 */
export const IconSize = {
  xs: 12,
  sm: 14,
  md: 17,
  lg: 20,
  xl: 24,
} as const;

/**
 * Control (button / input / icon-button) heights. A consistent control height
 * is what makes toolbars and forms line up without per-screen tweaking.
 */
export const ControlSize = {
  sm: 32,
  md: 38,
  lg: 44,
} as const;

/**
 * Accent families. Each accent pairs a `solid` colour (icon / text / fill) with
 * a `soft` background (tile / chip / badge). This is the single source used by
 * AppBadge, AppChip, AppIconTile and AppStatus so a "blue chip" and a "blue
 * tile" are always the same two colours.
 */
export const Accent = {
  blue: { solid: Palette.blue, soft: Palette.blueSoft },
  orange: { solid: Palette.orange, soft: Palette.orangeSoft },
  purple: { solid: Palette.purple, soft: Palette.purpleSoft },
  green: { solid: Palette.green, soft: Palette.greenSoft },
  neutral: { solid: Palette.textSecondary, soft: Palette.cardMuted },
} as const;

export type AccentName = keyof typeof Accent;

/**
 * Semantic status → accent mapping for intervention/appointment states. Screens
 * and primitives should map a domain status to an AccentName here instead of
 * re-deciding "urgent = orange" in every component (as planning currently does
 * in three different files).
 */
export const StatusAccent = {
  done: 'green',
  inProgress: 'blue',
  urgent: 'orange',
  normal: 'neutral',
  info: 'blue',
  success: 'green',
  warning: 'orange',
  danger: 'orange',
} as const satisfies Record<string, AccentName>;

export type StatusName = keyof typeof StatusAccent;

/**
 * Typography ramp. A `variant` bundles fontSize + fontWeight + letterSpacing
 * (+ lineHeight where it matters) so text is declared once, semantically, via
 * <AppText variant="...">. These reproduce the styles already used across Home,
 * Planning and Rappels — they are a naming of the status quo, not a redesign.
 */
export const Typography = {
  display: { fontSize: 32, fontWeight: FontWeight.heavy, letterSpacing: LetterSpacing.tighter },
  title1: { fontSize: 30, fontWeight: FontWeight.bold, letterSpacing: LetterSpacing.tighter },
  title2: { fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: LetterSpacing.tight },
  title3: { fontSize: 19, fontWeight: FontWeight.bold, letterSpacing: LetterSpacing.tight },
  section: { fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: LetterSpacing.tight },
  headline: { fontSize: 17, fontWeight: FontWeight.bold, letterSpacing: LetterSpacing.snug },
  body: { fontSize: 16, fontWeight: FontWeight.regular, letterSpacing: LetterSpacing.none },
  bodyStrong: { fontSize: 16, fontWeight: FontWeight.semibold, letterSpacing: LetterSpacing.slight },
  callout: { fontSize: 15, fontWeight: FontWeight.medium, letterSpacing: LetterSpacing.slight },
  subhead: { fontSize: 14, fontWeight: FontWeight.regular, letterSpacing: LetterSpacing.slight },
  subheadStrong: { fontSize: 14, fontWeight: FontWeight.semibold, letterSpacing: LetterSpacing.slight },
  footnote: { fontSize: 13, fontWeight: FontWeight.regular, letterSpacing: LetterSpacing.slight },
  caption: { fontSize: 12, fontWeight: FontWeight.medium, letterSpacing: LetterSpacing.slight },
  overline: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.overline,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;

/**
 * Soft Layer UI — the subtle "second surface" depth used behind the day's
 * focal (in-progress) card. Never a substitute for `shadow.ts`; a second flat
 * layer peeking out from behind the card to suggest a light stack of paper.
 */
export const SoftLayer = {
  /** Vertical offset (px) of the second layer behind a focal card. */
  offset: 6,
  /** Second-layer tint behind the focal card — a faint blue/screen blend. */
  focalBackdrop: '#E4ECFB',
} as const;
