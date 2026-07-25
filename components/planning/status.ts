import { Accent, AccentName, StatusAccent } from '@/constants/design';
import type { AppointmentStatus } from './types';

/**
 * How a planning status looks — decided once, for the whole screen.
 *
 * Planning used to answer "what colour is urgent?" in three different files
 * (the card's STATUS_STYLE, the timeline's TIME_COLOR and its DOT_COLOR), which
 * is how a status ends up orange in one place and amber in another. The colour
 * itself is not chosen here either: it is read from the app-level
 * `StatusAccent` map, so Planning, Clients and Documents cannot drift apart.
 *
 * One rule: **a status has exactly one colour**. It tints its dot, its time
 * label and its badge — nothing else. Emphasis comes from hierarchy (a badge, a
 * lift, a step back), never from painting more of the card.
 */
export type StatusVisual = {
  /** Accent family, for components that need the soft background too (badges). */
  accent: AccentName;
  /** The status colour: timeline dot + time label. */
  color: string;
  /**
   * Badge label, or `null` for the quiet states. Only work that needs the eye
   * gets a badge — a badge on every card is a badge on none.
   */
  badge: string | null;
  /** Finished work steps back instead of shouting "done". */
  muted: boolean;
  /** The one card the eye should land on first. */
  focal: boolean;
};

function visual(
  status: AppointmentStatus,
  badge: string | null,
  { muted = false, focal = false }: { muted?: boolean; focal?: boolean } = {}
): StatusVisual {
  const accent = StatusAccent[status];
  return { accent, color: Accent[accent].solid, badge, muted, focal };
}

export const STATUS_VISUAL: Record<AppointmentStatus, StatusVisual> = {
  done: visual('done', null, { muted: true }),
  inProgress: visual('inProgress', 'En cours', { focal: true }),
  urgent: visual('urgent', 'Urgent'),
  normal: visual('normal', null),
};
