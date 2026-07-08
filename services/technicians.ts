/**
 * Async facade over `data/technicians.ts`. The roster is a small static list
 * today; wrapping it means the appointment-creation screen never needs to
 * change when a real "team members" backend lands.
 */
import * as TechniciansData from '@/data/technicians';

export type { Technician } from '@/data/technicians';

export async function listTechnicians(): Promise<TechniciansData.Technician[]> {
  return [...TechniciansData.TECHNICIANS];
}

export async function getCurrentTechnician(): Promise<TechniciansData.Technician> {
  return TechniciansData.CURRENT_TECHNICIAN;
}
