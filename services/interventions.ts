import * as InterventionsData from '@/data/interventions';
import { Intervention } from '@/components/intervention/types';

export type { InterventionInput } from '@/data/interventions';

export async function getIntervention(id?: string): Promise<Intervention> {
  return InterventionsData.getIntervention(id);
}

export async function updateIntervention(
  id: string,
  patch: InterventionsData.InterventionInput
): Promise<Intervention | undefined> {
  return InterventionsData.updateIntervention(id, patch);
}
