/**
 * Async facade over `data/documents/contrats.ts` — the only thing screens
 * should import for contrats. Today it just wraps the mock array; swapping
 * in Supabase later means rewriting the inside of these functions only, no
 * screen changes.
 */
import * as ContratsData from '@/data/documents/contrats';

export type { Contrat, ContratInput, ContratStatus } from '@/data/documents/contrats';
export { CONTRAT_STATUS_META, CONTRAT_STATUS_ORDER } from '@/data/documents/contrats';

export async function listContrats(): Promise<ContratsData.Contrat[]> {
  return [...ContratsData.MOCK_CONTRATS];
}

export async function getContrat(id: string): Promise<ContratsData.Contrat | undefined> {
  return ContratsData.getContratById(id);
}

export async function createContrat(input: ContratsData.ContratInput): Promise<ContratsData.Contrat> {
  return ContratsData.createContrat(input);
}

export async function updateContrat(
  id: string,
  patch: Partial<ContratsData.ContratInput>
): Promise<ContratsData.Contrat | undefined> {
  return ContratsData.updateContrat(id, patch);
}

export async function deleteContrat(id: string): Promise<void> {
  ContratsData.deleteContrat(id);
}

export async function contratCountsByStatus(): Promise<Record<ContratsData.ContratStatus, number>> {
  return ContratsData.contratCountsByStatus();
}

export type ContratSummary = ReturnType<typeof ContratsData.contratSummary>;

export async function contratSummary(): Promise<ContratSummary> {
  return ContratsData.contratSummary();
}

export async function expiringContrats(withinDays?: number): Promise<ContratsData.Contrat[]> {
  return ContratsData.expiringContrats(withinDays);
}
