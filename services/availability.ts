/**
 * Async facade over `data/availability.ts`'s mock busy-interval directory.
 * Not consumed directly by any screen today — `components/appointment/
 * appointment-utils.ts`'s slot-availability functions are the real call
 * site and already read `MOCK_BUSY_BY_WEEKDAY` from `@/data/availability`.
 * This file exists purely so the raw dataset is reachable the same way as
 * every other entity, should a future call site need it directly.
 */
import * as AvailabilityData from '@/data/availability';

export type { BusyInterval } from '@/data/availability';

export async function getBusyIntervalsByWeekday(): Promise<Record<number, AvailabilityData.BusyInterval[]>> {
  return AvailabilityData.MOCK_BUSY_BY_WEEKDAY;
}
