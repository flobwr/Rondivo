import { CalendarDay, DayItem } from '@/components/planning/types';

export const SELECTED_DAY_INDEX = 2; // Wednesday the 1st

export const CALENDAR_DAYS: CalendarDay[] = [
  { date: 29, dayLabel: 'LUN', hasAppointments: true, hasUrgent: false },
  { date: 30, dayLabel: 'MAR', hasAppointments: true, hasUrgent: false },
  { date: 1, dayLabel: 'MER', hasAppointments: true, hasUrgent: false },
  { date: 2, dayLabel: 'JEU', hasAppointments: true, hasUrgent: true },
  { date: 3, dayLabel: 'VEN', hasAppointments: true, hasUrgent: false },
  { date: 4, dayLabel: 'SAM', hasAppointments: false, hasUrgent: false },
  { date: 5, dayLabel: 'DIM', hasAppointments: false, hasUrgent: false },
];

const WEDNESDAY_ITEMS: DayItem[] = [
  {
    kind: 'appointment',
    data: {
      id: 'apt-1',
      time: '08:00',
      duration: '1h00',
      client: 'Martin Faure',
      type: 'Entretien chaudière',
      address: 'Av. Félix Faure, 69003 Lyon',
      status: 'done',
    },
  },
  { kind: 'travel', data: { id: 'travel-1', minutes: 12, km: 4.2 } },
  {
    kind: 'appointment',
    data: {
      id: 'apt-2',
      time: '10:30',
      duration: '1h30',
      client: 'Sophie Bernard',
      type: 'Fuite sous évier',
      address: '8 rue Molière, 69003 Lyon',
      status: 'inProgress',
    },
  },
  { kind: 'travel', data: { id: 'travel-2', minutes: 18, km: 6.1 } },
  {
    kind: 'appointment',
    data: {
      id: 'apt-3',
      time: '13:30',
      duration: '2h00',
      client: 'Jean Moreau',
      type: 'Installation radiateur',
      address: '23 cours Gambetta, 69004 Lyon',
      status: 'normal',
    },
  },
  { kind: 'travel', data: { id: 'travel-3', minutes: 7, km: 2.3 } },
  {
    kind: 'appointment',
    data: {
      id: 'apt-4',
      time: '16:00',
      duration: '1h30',
      client: 'Marie Lefebvre',
      type: 'Tableau électrique',
      address: '3 place Bellecour, 69002 Lyon',
      status: 'urgent',
    },
  },
];

export const DAY_ITEMS_BY_INDEX: Record<number, DayItem[]> = {
  0: [],
  1: [],
  2: WEDNESDAY_ITEMS,
  3: [
    {
      kind: 'appointment',
      data: {
        id: 'apt-j1',
        time: '09:00',
        duration: '2h00',
        client: 'Paul Rousseau',
        type: 'Diagnostic chauffage',
        address: '14 rue Garibaldi, 69003 Lyon',
        status: 'normal',
      },
    },
  ],
  4: [],
  5: [],
  6: [],
};

export const PLANNING_MONTH_LABEL = 'JUIN 2025';
