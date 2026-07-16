/**
 * Domain model of the Planning screen.
 *
 * The six statuses mirror the real lifecycle of an intervention in the field:
 * planned → enRoute → arrived → inProgress → done, with postponed as the
 * escape hatch when a job is rescheduled.
 */

export type InterventionStatus =
  | 'planned'
  | 'enRoute'
  | 'arrived'
  | 'inProgress'
  | 'done'
  | 'postponed';

export type InterventionPriority = 'normal' | 'high' | 'urgent';

export type Intervention = {
  id: string;
  start: string; // '08:00'
  end: string; // '09:00'
  durationMin: number;
  client: string;
  type: string;
  address: string;
  status: InterventionStatus;
  priority: InterventionPriority;
};

export type TravelLeg = {
  id: string;
  minutes: number;
  km: number;
  /** live-traffic hook — colours the small dot on the travel capsule */
  traffic: 'fluid' | 'dense' | 'jammed';
};

export type DayItem =
  | { kind: 'intervention'; data: Intervention }
  | { kind: 'travel'; data: TravelLeg }
  | { kind: 'now'; id: string };

export type CalendarDay = {
  date: number;
  dayLabel: string; // 'Lun', 'Mar', …
  count: number; // number of interventions that day
  hasUrgent: boolean;
};

export type DayWeather = {
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'cloud-snow';
  temp: string; // '21°'
};
