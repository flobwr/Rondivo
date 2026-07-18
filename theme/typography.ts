import type { TextStyle } from 'react-native';

/**
 * Rondivo type system — SF Pro (system font), Apple-adjacent hierarchy,
 * tuned one notch tighter than iOS defaults because Rondivo is a dense
 * working tool, not a reading app.
 *
 * Numbers that mean something (hours, durations, km, amounts, counts) are
 * ALWAYS tabular — spread `Numeric` (or use a `Type` preset + `Numeric`).
 */

export const FontSize = {
  hero: 30, // screen large-titles ("Bonjour Thomas", client name)
  title: 22, // card headlines, sheet titles
  section: 17, // section headers
  cardLabel: 15, // tile labels
  body: 16,
  label: 14, // form labels, list metadata
  small: 13,
  tiny: 12,
} as const;

/** Complete text presets — size + line-height + weight + tracking together. */
export const Type = {
  largeTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.45,
  },
  heading: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.35,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.25,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0,
  },
} as const satisfies Record<string, TextStyle>;

/** Tabular figures — mandatory for hours, durations, km, € and stats. */
export const Numeric: TextStyle = { fontVariant: ['tabular-nums'] };
