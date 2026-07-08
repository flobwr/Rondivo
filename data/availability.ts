export type BusyInterval = { start: number; end: number };

/**
 * Mocked existing bookings per weekday, so the "Heure" strip can demonstrate
 * real three-state availability without a backend. Minutes since midnight.
 */
export const MOCK_BUSY_BY_WEEKDAY: Record<number, BusyInterval[]> = {
  0: [], // Sunday
  1: [{ start: 9 * 60, end: 10 * 60 }, { start: 14 * 60, end: 16 * 60 }], // Monday
  2: [{ start: 8 * 60, end: 9 * 60 + 30 }], // Tuesday
  3: [{ start: 10 * 60 + 30, end: 12 * 60 }, { start: 15 * 60, end: 15 * 60 + 30 }], // Wednesday
  4: [{ start: 7 * 60 + 30, end: 8 * 60 + 30 }, { start: 13 * 60, end: 14 * 60 + 30 }], // Thursday
  5: [{ start: 9 * 60, end: 11 * 60 }], // Friday
  6: [], // Saturday
};
