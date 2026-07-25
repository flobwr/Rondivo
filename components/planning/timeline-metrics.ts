import { Spacing } from '@/constants/design';

/**
 * The geometry of the planning timeline, in one place.
 *
 * The rail, the dots, the skeleton and the row rhythm all have to agree to the
 * pixel — a rail that stops 3 px short of a dot is exactly the kind of defect
 * that only shows up at 400 % zoom. Timeline.tsx and LoadingState.tsx both read
 * these values instead of each keeping their own copy.
 */

/** Width of the left gutter holding the time label, the dot and the rail. */
export const GUTTER_WIDTH = 50;

/** Top padding of the gutter — aligns the time label with the card's client name. */
export const GUTTER_PADDING_TOP = 14;

/** Line height of the time label. */
export const TIME_LINE_HEIGHT = 16;

/** Gap between the time label and the dot. */
export const TIME_GAP = 6;

/** Diameter of the timeline dot (halo included). */
export const DOT_SIZE = 10;

/** Width of the vertical rail. */
export const RAIL_WIDTH = 2;

/** Vertical gap between two timeline rows. */
export const ROW_GAP = Spacing.md;

/**
 * Distance from the top of a row to the centre of its dot. Derived, never
 * typed by hand: the rail caps itself exactly on the first and last dot.
 */
export const DOT_CENTER = GUTTER_PADDING_TOP + TIME_LINE_HEIGHT + TIME_GAP + DOT_SIZE / 2;

/** Horizontal offset that centres the rail inside the gutter. */
export const RAIL_LEFT = (GUTTER_WIDTH - RAIL_WIDTH) / 2;

/**
 * Rendered height of an appointment card (padding + the three text lines).
 * Only the skeleton needs it — so the placeholder occupies exactly the space
 * the real card will take and nothing shifts when the data lands.
 */
export const CARD_HEIGHT = 84;
