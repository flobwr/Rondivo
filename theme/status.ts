/**
 * Rondivo status surfaces — the one shared language for state.
 *
 * Every "state" in the app (a paid invoice, an overdue one, a device that
 * needs attention, an informational note) is drawn the same way, on every
 * screen: a very light WASH, a text-safe INK, and — only for the dot or the
 * icon — the VIVID accent. No screen invents its own status colours, and
 * NOTHING wears a loud coloured border: weight comes from the wash and the
 * ink, never from an outline.
 *
 *   success  → green   (paid, done, up to date)
 *   warning  → orange  (to relaunch, expiring, to finish)
 *   danger   → red     (unpaid, overdue, refused)
 *   info     → blue    (in progress, the brand's own attention)
 *   neutral  → grey    (quiet metadata, counts)
 *
 * The tones are named by MEANING (`StatusTone`), but the colour names
 * (`blue`/`green`/…) are kept as aliases so the existing `Badge` vocabulary
 * keeps working. Both resolve through this one function, so a single call
 * site tunes every state surface across Documents, Clients, Planning, Home
 * and Notifications at once — and because it reads the LIVE palette, every
 * surface follows the active theme (including the dark papers).
 */

import type { PaletteShape } from './palette';

/** Semantic tones — the meaning of a state. */
export type SemanticTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Colour-named tones — the historical `Badge` vocabulary. */
export type ColorTone = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'teal' | 'neutral';

export type StatusTone = SemanticTone | ColorTone;

/** A resolved status surface: wash to sit on, ink to write with, vivid for the dot/icon. */
export type StatusSurface = {
  /** Very light wash — safe as a full background for pills, tiles, chips. */
  wash: string;
  /** Text-safe ink (≥ 4.5:1 on `wash`) — the ONLY colour allowed as text. */
  ink: string;
  /** Vivid accent — reserved for the dot or a small icon, never for text. */
  vivid: string;
};

const SEMANTIC_TO_COLOR: Record<SemanticTone, ColorTone> = {
  success: 'green',
  warning: 'orange',
  danger: 'red',
  info: 'blue',
  neutral: 'neutral',
};

/**
 * Resolve a tone to its surface on the given (live) palette. Pass
 * `useTheme().palette` from a component so the surface follows the theme.
 */
export function getStatusSurface(palette: PaletteShape, tone: StatusTone): StatusSurface {
  const color: ColorTone = tone in SEMANTIC_TO_COLOR ? SEMANTIC_TO_COLOR[tone as SemanticTone] : (tone as ColorTone);

  switch (color) {
    case 'blue':
      return { wash: palette.blueSoft, ink: palette.blue, vivid: palette.blue };
    case 'green':
      return { wash: palette.greenSoft, ink: palette.greenInk, vivid: palette.green };
    case 'orange':
      return { wash: palette.orangeSoft, ink: palette.orangeInk, vivid: palette.orange };
    case 'red':
      return { wash: palette.redSoft, ink: palette.redInk, vivid: palette.red };
    case 'purple':
      return { wash: palette.purpleSoft, ink: palette.purple, vivid: palette.purple };
    case 'teal':
      return { wash: palette.tealSoft, ink: palette.teal, vivid: palette.teal };
    case 'neutral':
    default:
      return { wash: palette.inset, ink: palette.textSecondary, vivid: palette.textTertiary };
  }
}
