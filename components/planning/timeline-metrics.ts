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

/** Width of the left gutter holding the dots and the rail. */
export const GUTTER_WIDTH = 36;

/** Length of the small horizontal branch handing a dotted row off to its card. */
export const BRANCH_LEN = 12;

/** Horizontal padding of the timeline list. */
export const LIST_PADDING_H = Spacing.xl;

/** Vertical gap between two timeline rows. */
export const ROW_GAP = Spacing.xl;

/** Diameter of a status marker (the largest dot form — the active beacon). */
export const DOT_SIZE = 26;

/** Height of the "Maintenant" row. */
export const NOW_ROW_HEIGHT = 30;

/**
 * Distance from the top of a row to the centre of its rail dot, per row kind.
 * The rail caps itself on the first and last dot using these.
 */
export const DOT_CENTER: Record<string, number> = {
  card: 22,
  break: 17,
  now: NOW_ROW_HEIGHT / 2,
};

/** Rendered height of an intervention card — used by the skeleton only. */
export const CARD_HEIGHT = 100;
