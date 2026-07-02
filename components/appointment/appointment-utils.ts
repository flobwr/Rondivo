import { type FeatherIconName } from '@/components/clients/types';

export type Priority = 'normal' | 'high' | 'urgent';
export type Recurrence = 'none' | 'weekly' | 'biweekly' | 'monthly';

export const PRIORITY_META: Record<Priority, { label: string; tint: 'blue' | 'orange' | 'red'; icon: FeatherIconName }> = {
  normal: { label: 'Normale', tint: 'blue', icon: 'flag' },
  high: { label: 'Haute', tint: 'orange', icon: 'flag' },
  urgent: { label: 'Urgente', tint: 'red', icon: 'alert-triangle' },
};

export const RECURRENCE_META: Record<Recurrence, string> = {
  none: 'Aucune',
  weekly: 'Chaque semaine',
  biweekly: 'Toutes les 2 semaines',
  monthly: 'Chaque mois',
};

export const RECURRENCE_ORDER: Recurrence[] = ['none', 'weekly', 'biweekly', 'monthly'];

export type Reminder = 'none' | '30min' | '1h' | 'dayBefore';

export const REMINDER_META: Record<Reminder, string> = {
  none: 'Aucun',
  '30min': '30 min avant',
  '1h': '1 h avant',
  dayBefore: 'La veille',
};

export const REMINDER_ORDER: Reminder[] = ['none', '30min', '1h', 'dayBefore'];

export type AttachmentItem = { id: string; name: string };

const DAYS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const DAYS_LONG = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MONTHS_FULL = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export type DayOption = {
  key: string; // YYYY-MM-DD
  date: Date;
  /** Short weekday, always 3 letters ("Lun", "Mar"…) — used in compact contexts. */
  weekdayLabel: string;
  dayNum: number;
  isWeekend: boolean;
  /** What the date chip actually displays: "Aujourd'hui" / "Demain" / "Mer 4". */
  chipLabel: string;
};

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The next `count` days starting today — the date strip. */
export function buildDays(count: number, from: Date = new Date()): DayOption[] {
  const base = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Array.from({ length: count }).map((_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    const dow = date.getDay();
    const weekdayLabel = DAYS_SHORT[dow];
    const chipLabel = i === 0 ? "Aujourd'hui" : i === 1 ? 'Demain' : `${weekdayLabel} ${date.getDate()}`;
    return { key: toKey(date), date, weekdayLabel, dayNum: date.getDate(), isWeekend: dow === 0 || dow === 6, chipLabel };
  });
}

/** Business-hours slots (07:00 → 19:00, 30-min steps). */
export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 7; h <= 19; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 19) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

/** First logical availability: next round slot ≥ now+1h today, else tomorrow 08:00. */
export function defaultStart(now: Date = new Date()): { dayKey: string; time: string } {
  const days = buildDays(2, now);
  const soon = new Date(now.getTime() + 60 * 60 * 1000);
  const roundedMin = soon.getMinutes() <= 30 ? 30 : 60;
  const candidate = new Date(soon);
  if (roundedMin === 60) {
    candidate.setHours(candidate.getHours() + 1, 0, 0, 0);
  } else {
    candidate.setMinutes(30, 0, 0);
  }
  const h = candidate.getHours();
  if (h >= 7 && h <= 18) {
    return { dayKey: days[0].key, time: `${String(h).padStart(2, '0')}:${candidate.getMinutes() === 30 ? '30' : '00'}` };
  }
  // Outside business hours → tomorrow 08:00
  return { dayKey: days[1].key, time: '08:00' };
}

export function addMinutesToTime(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
  if (minutes >= 420) return 'Journée';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${String(m).padStart(2, '0')}`;
}

export function formatDayLong(key: string): string {
  const [y, mo, d] = key.split('-').map(Number);
  const date = new Date(y, mo - 1, d);
  const today = new Date();
  const todayKey = toKey(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (key === todayKey) return "Aujourd'hui";
  if (key === toKey(tomorrow)) return 'Demain';
  return `${DAYS_LONG[date.getDay()]} ${d} ${MONTHS[mo - 1]}`;
}

export function formatDayShort(key: string): string {
  const [y, mo, d] = key.split('-').map(Number);
  const date = new Date(y, mo - 1, d);
  return `${DAYS_SHORT[date.getDay()]} ${d} ${MONTHS[mo - 1]}`;
}

/** "Ven 3 juillet" — used by the sticky footer recap, spelled out for clarity. */
export function formatDayFooter(key: string): string {
  const [y, mo, d] = key.split('-').map(Number);
  const date = new Date(y, mo - 1, d);
  return `${DAYS_SHORT[date.getDay()]} ${d} ${MONTHS_FULL[mo - 1]}`;
}

export const DURATION_OPTIONS = [30, 60, 90, 120, 180, 420];

// ── Slot availability ───────────────────────────────────────────────────────
// Mocked existing bookings per weekday, so the "Heure" strip can demonstrate
// real three-state availability without a backend. Minutes since midnight.

type BusyInterval = { start: number; end: number };

const MOCK_BUSY_BY_WEEKDAY: Record<number, BusyInterval[]> = {
  0: [], // Sunday
  1: [{ start: 9 * 60, end: 10 * 60 }, { start: 14 * 60, end: 16 * 60 }], // Monday
  2: [{ start: 8 * 60, end: 9 * 60 + 30 }], // Tuesday
  3: [{ start: 10 * 60 + 30, end: 12 * 60 }, { start: 15 * 60, end: 15 * 60 + 30 }], // Wednesday
  4: [{ start: 7 * 60 + 30, end: 8 * 60 + 30 }, { start: 13 * 60, end: 14 * 60 + 30 }], // Thursday
  5: [{ start: 9 * 60, end: 11 * 60 }], // Friday
  6: [], // Saturday
};

const DAY_CLOSE_MINUTES = 19 * 60 + 30; // soft closing time, past the last 19:00 slot

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function getBusyIntervals(dayKey: string): BusyInterval[] {
  const [y, mo, d] = dayKey.split('-').map(Number);
  return MOCK_BUSY_BY_WEEKDAY[new Date(y, mo - 1, d).getDay()] ?? [];
}

export type SlotStatus = 'available' | 'busy' | 'short';

export type SlotInfo = {
  time: string;
  status: SlotStatus;
  /** Discreet caption shown under the time for non-available slots. */
  note?: string;
};

/**
 * Three-state availability for every slot on a given day, given the currently
 * selected duration. Recomputes instantly (pure function) so changing the day
 * or the duration always reflects immediately, with no perceptible delay.
 */
export function computeSlots(dayKey: string, durationMinutes: number): SlotInfo[] {
  const busy = getBusyIntervals(dayKey)
    .slice()
    .sort((a, b) => a.start - b.start);
  // Closing time acts as a virtual boundary so trailing slots that can't fit
  // before end-of-day read as "too short" rather than silently available.
  const boundaries = [...busy, { start: DAY_CLOSE_MINUTES, end: 24 * 60 }];

  return TIME_SLOTS.map((time) => {
    const start = toMinutes(time);
    const end = start + durationMinutes;

    const insideBusy = busy.find((b) => start >= b.start && start < b.end);
    if (insideBusy) return { time, status: 'busy', note: 'Occupé' };

    const nextBoundary = boundaries.find((b) => b.start >= start);
    if (nextBoundary && end > nextBoundary.start) {
      const availableMinutes = Math.max(0, nextBoundary.start - start);
      return {
        time,
        status: 'short',
        note: availableMinutes > 0 ? `${availableMinutes} min disponibles` : 'Créneau trop court',
      };
    }

    return { time, status: 'available' };
  });
}

/** First available slot at or after `time`, falling back to the day's first available slot. */
export function nearestAvailableSlot(slots: SlotInfo[], time: string): string | null {
  const startMin = toMinutes(time);
  const atOrAfter = slots.find((s) => s.status === 'available' && toMinutes(s.time) >= startMin);
  if (atOrAfter) return atOrAfter.time;
  const first = slots.find((s) => s.status === 'available');
  return first ? first.time : null;
}
