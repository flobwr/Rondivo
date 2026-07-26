/**
 * Rondivo layout tokens — a strict 4-pt grid.
 *
 * The gutter is 20 (down from a looser 24) and the section rhythm is 28:
 * slightly tighter margins, noticeably more air BETWEEN groups. Breathing
 * comes from vertical rhythm, not from fat edges.
 */

export const Spacing = {
  screen: 20, // horizontal screen gutter
  section: 28, // vertical air between sections
  sectionGap: 12, // compact gap between stacked large blocks
  cardGap: 12, // gap inside card grids
  cardPadding: 18, // interior padding of a sheet/card
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/**
 * Radii — one family, less balloon than before. A sheet is 20, a tile 14,
 * a control 12; anything fully round is `pill`.
 */
export const Radius = {
  hero: 26, // the single dominant card of a screen
  card: 20, // standard sheet
  tile: 14, // tiles, inputs, small cards
  control: 12, // chips, small buttons, wells
  pill: 999,
} as const;

/** Control metrics — one-hand, gloves-on touch targets. */
export const Size = {
  touchTarget: 48, // minimum interactive height/width
  buttonHeight: 52, // primary CTA
  buttonHeightCompact: 40,
  iconWellCompact: 30, // circular icon button nested INSIDE a card (travel leg's GPS)
  iconWell: 38, // circular icon button (headers)
  well: 42, // round chrome disc: masthead wells, calendar day disc
  /**
   * The one large round action of a screen — Home's itinerary button and
   * Planning's add-intervention button are the same object at the same size,
   * so the two mastheads read as the same hand.
   */
  roundAction: 50,
  dockHeight: 64, // floating bottom dock (content, excl. safe area)
} as const;
