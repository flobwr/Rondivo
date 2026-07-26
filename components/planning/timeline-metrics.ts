import { Spacing } from '@/theme';

/**
 * The geometry of the planning timeline, in one place.
 *
 * The rail, the dots, the row rhythm and the loading skeleton all have to
 * agree to the pixel. They did not: the skeleton drew an 18 px dot in a 36 px
 * gutter padded 17 from the top, while the real rail anchors a 26 px dot at
 * 22 — so the placeholder rail sat a few pixels off the rail that replaced it,
 * and every card visibly nudged at the end of a load.
 */

/**
 * Horizontal padding of the timeline list — the app's one screen gutter.
 *
 * It used to be `Spacing.xl` (24) while the masthead and the day strip used
 * `Spacing.screen` (20): every card on the day was four pixels narrower than
 * the title above it, on both sides. Same token everywhere now, so the screen
 * has a single left and right edge from the month down to the last travel leg.
 */
export const LIST_PADDING_H = Spacing.screen;

/**
 * Width of the left gutter holding the status dots — exactly one dot wide.
 *
 * That equality is the point: a status marker fills its gutter edge to edge,
 * so the dots' own left edge lands on `LIST_PADDING_H`, the same line the
 * month and the day strip start from. The rail is not a column parked beside
 * the content, it IS the screen's left edge.
 */
export const GUTTER_WIDTH = 24;

/** Length of the small horizontal branch handing a dotted row off to its card. */
export const BRANCH_LEN = Spacing.sm;

/** Hairline weight of the rail's marks — branches and segments alike. */
export const RAIL_WEIGHT = 1.5;

/**
 * Vertical gap between two timeline rows — the single unit the whole screen's
 * vertical rhythm is built on. `Timeline`'s top padding and the air under the
 * day strip both resolve to this same token, so the space above the first row
 * equals the space between every row after it, and the "segment" tick derives
 * its own centring from it too. One number, reused everywhere a gap is needed,
 * instead of each spot inventing its own.
 *
 * `lg`, not `section`: `section` (28) is the air BETWEEN groups on the Home —
 * inside a list, the Home's own cards sit far closer together. The day is one
 * group, so its rows use the tighter unit.
 */
export const ROW_GAP = Spacing.lg;

/** Height of the small segment tick bridging two back-to-back dotted rows. */
export const SEGMENT_LEN = 10;

/** Diameter of a status marker (the largest dot form — the active beacon). */
export const DOT_SIZE = 24;

/** Height of the "Maintenant" row. */
export const NOW_ROW_HEIGHT = 28;

/**
 * Distance from the top of a row to the centre of its rail dot, per row kind.
 *
 * For a card this is the centre of its first line — the time chip and the
 * client name — so the dot, the branch and the card's own headline all share
 * one horizontal axis.
 */
export const DOT_CENTER: Record<string, number> = {
  card: 27,
  break: 17,
  now: NOW_ROW_HEIGHT / 2,
};

/** Rendered height of an intervention card — used by the skeleton only. */
export const CARD_HEIGHT = 92;
