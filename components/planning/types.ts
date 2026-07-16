/**
 * Domain model of the Planning screen.
 *
 * The seven statuses are strictly operational — they mirror the real lifecycle
 * of an intervention in the field: planned → enRoute → arrived → inProgress →
 * done, with postponed and cancelled as the two rescheduling outcomes.
 * Urgency is deliberately NOT part of this model: a planned job stays planned,
 * urgent work is handled by its own workflow upstream.
 */

export type InterventionStatus =
  | 'planned'
  | 'enRoute'
  | 'arrived'
  | 'inProgress'
  | 'done'
  | 'postponed'
  | 'cancelled';

export type Intervention = {
  id: string;
  start: string; // '08:00'
  end: string; // '09:00'
  durationMin: number;
  client: string;
  type: string;
  address: string;
  status: InterventionStatus;
};

export type TravelLeg = {
  id: string;
  minutes: number;
  km: number;
  /** live-traffic hook — colours the small dot on the travel capsule */
  traffic: 'fluid' | 'dense' | 'jammed';
};

export type BreakSlot = {
  id: string;
  start: string;
  end: string;
  label: string; // 'Pause déjeuner'
};

export type DayItem =
  | { kind: 'intervention'; data: Intervention }
  | { kind: 'travel'; data: TravelLeg }
  | { kind: 'break'; data: BreakSlot };

export type CalendarDay = {
  date: number;
  dayLabel: string; // 'Lun', 'Mar', …
  count: number; // number of interventions that day
};

export type DayWeather = {
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'cloud-snow';
  temp: string; // '21°'
};

/**
 * One day of planning as the screen consumes it. `nowMin` (minutes since
 * midnight) is only set on a "live" day — it drives the next-up hero, the
 * countdowns and the punctuality maths. Past and future days omit it.
 */
export type DayScenario = {
  items: DayItem[];
  nowMin?: number;
  weather?: DayWeather;
};
