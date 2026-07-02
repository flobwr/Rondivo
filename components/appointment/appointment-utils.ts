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

const DAYS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const DAYS_LONG = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export type DayOption = {
  key: string; // YYYY-MM-DD
  date: Date;
  weekdayLabel: string; // "Auj." | "Dem." | "Mer"
  dayNum: number;
  isWeekend: boolean;
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
    const weekdayLabel = i === 0 ? 'Auj.' : i === 1 ? 'Dem.' : DAYS_SHORT[dow];
    return { key: toKey(date), date, weekdayLabel, dayNum: date.getDate(), isWeekend: dow === 0 || dow === 6 };
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

export const DURATION_OPTIONS = [30, 60, 90, 120, 180, 420];
