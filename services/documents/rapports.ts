/**
 * Async facade over `data/documents/rapports.ts` — the only thing screens
 * should import for rapports. Today it just wraps the mock array; swapping
 * in Supabase later means rewriting the inside of these functions only, no
 * screen changes.
 */
import * as RapportsData from '@/data/documents/rapports';

export type { ChecklistItem, Rapport, RapportInput, RapportStatus } from '@/data/documents/rapports';
export { RAPPORT_STATUS_META, RAPPORT_STATUS_ORDER } from '@/data/documents/rapports';

export async function listRapports(): Promise<RapportsData.Rapport[]> {
  return [...RapportsData.MOCK_RAPPORTS];
}

export async function getRapport(id: string): Promise<RapportsData.Rapport | undefined> {
  return RapportsData.getRapportById(id);
}

export async function createRapport(input: RapportsData.RapportInput): Promise<RapportsData.Rapport> {
  return RapportsData.createRapport(input);
}

export async function updateRapport(
  id: string,
  patch: Partial<RapportsData.RapportInput>
): Promise<RapportsData.Rapport | undefined> {
  return RapportsData.updateRapport(id, patch);
}

export async function deleteRapport(id: string): Promise<void> {
  RapportsData.deleteRapport(id);
}

export async function rapportCountsByStatus(): Promise<Record<RapportsData.RapportStatus, number>> {
  return RapportsData.rapportCountsByStatus();
}

export type RapportSummary = ReturnType<typeof RapportsData.rapportSummary>;

export async function rapportSummary(): Promise<RapportSummary> {
  return RapportsData.rapportSummary();
}

export async function rapportsToComplete(): Promise<RapportsData.Rapport[]> {
  return RapportsData.rapportsToComplete();
}
