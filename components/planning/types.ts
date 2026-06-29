export type AppointmentStatus = 'done' | 'inProgress' | 'urgent' | 'normal';

export type PlanningAppointment = {
  id: string;
  time: string;
  duration: string;
  client: string;
  type: string;
  address: string;
  status: AppointmentStatus;
};

export type TravelLeg = {
  id: string;
  minutes: number;
  km: number;
};

export type DayItem =
  | { kind: 'appointment'; data: PlanningAppointment }
  | { kind: 'travel'; data: TravelLeg };

export type CalendarDay = {
  date: number;
  dayLabel: string; // 'LUN', 'MAR', …
  hasUrgent: boolean;
  hasAppointments: boolean;
};
