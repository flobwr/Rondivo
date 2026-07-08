import * as PrestationsData from '@/data/plus/prestations';

export type { Prestation, PrestationInput, PrestationUnit } from '@/data/plus/prestations';
export { PRESTATION_UNIT_LABEL, PRESTATION_UNIT_ORDER } from '@/data/plus/prestations';

export async function listPrestations(): Promise<PrestationsData.Prestation[]> {
  return [...PrestationsData.PRESTATIONS];
}

export async function getPrestation(id: string): Promise<PrestationsData.Prestation | undefined> {
  return PrestationsData.getPrestationById(id);
}

export async function createPrestation(input: PrestationsData.PrestationInput): Promise<PrestationsData.Prestation> {
  return PrestationsData.createPrestation(input);
}

export async function updatePrestation(
  id: string,
  patch: Partial<PrestationsData.PrestationInput>
): Promise<PrestationsData.Prestation | undefined> {
  return PrestationsData.updatePrestation(id, patch);
}

export async function deletePrestation(id: string): Promise<void> {
  PrestationsData.deletePrestation(id);
}
