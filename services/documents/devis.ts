/**
 * Async facade over `data/documents/devis.ts` — the only thing screens should
 * import for devis. Today it just wraps the mock array; swapping in Supabase
 * later means rewriting the inside of these functions only, no screen changes.
 */
import * as DevisData from '@/data/documents/devis';

export type { Devis, DevisInput, DevisStatus } from '@/data/documents/devis';
export { DEVIS_STATUS_META, DEVIS_STATUS_ORDER } from '@/data/documents/devis';

export async function listDevis(): Promise<DevisData.Devis[]> {
  return [...DevisData.MOCK_DEVIS];
}

export async function getDevis(id: string): Promise<DevisData.Devis | undefined> {
  return DevisData.getDevisById(id);
}

export async function createDevis(input: DevisData.DevisInput): Promise<DevisData.Devis> {
  return DevisData.createDevis(input);
}

export async function updateDevis(
  id: string,
  patch: Partial<DevisData.DevisInput>
): Promise<DevisData.Devis | undefined> {
  return DevisData.updateDevis(id, patch);
}

export async function deleteDevis(id: string): Promise<void> {
  DevisData.deleteDevis(id);
}

export async function devisCountsByStatus(): Promise<Record<DevisData.DevisStatus, number>> {
  return DevisData.devisCountsByStatus();
}

export type DevisSummary = ReturnType<typeof DevisData.devisSummary>;

export async function devisSummary(): Promise<DevisSummary> {
  return DevisData.devisSummary();
}

export async function expiringDevis(withinDays?: number): Promise<DevisData.Devis[]> {
  return DevisData.expiringDevis(withinDays);
}
