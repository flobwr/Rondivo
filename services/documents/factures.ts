/**
 * Async facade over `data/documents/factures.ts` — the only thing screens
 * should import for factures. Today it just wraps the mock array; swapping in
 * Supabase later means rewriting the inside of these functions only, no
 * screen changes.
 */
import * as FacturesData from '@/data/documents/factures';

export type { Facture, FactureInput, FactureStatus, Payment, PaymentMethod } from '@/data/documents/factures';
export { FACTURE_STATUS_META, FACTURE_STATUS_ORDER, PAYMENT_METHOD_LABEL } from '@/data/documents/factures';

export async function listFactures(): Promise<FacturesData.Facture[]> {
  return [...FacturesData.MOCK_FACTURES];
}

export async function getFacture(id: string): Promise<FacturesData.Facture | undefined> {
  return FacturesData.getFactureById(id);
}

export async function createFacture(input: FacturesData.FactureInput): Promise<FacturesData.Facture> {
  return FacturesData.createFacture(input);
}

export async function updateFacture(
  id: string,
  patch: Partial<FacturesData.FactureInput>
): Promise<FacturesData.Facture | undefined> {
  return FacturesData.updateFacture(id, patch);
}

export async function deleteFacture(id: string): Promise<void> {
  FacturesData.deleteFacture(id);
}

export async function addPayment(
  factureId: string,
  payment: FacturesData.Payment
): Promise<FacturesData.Facture | undefined> {
  return FacturesData.addPayment(factureId, payment);
}

export async function factureCountsByStatus(): Promise<Record<FacturesData.FactureStatus, number>> {
  return FacturesData.factureCountsByStatus();
}

export type FactureSummary = ReturnType<typeof FacturesData.factureSummary>;

export async function factureSummary(): Promise<FactureSummary> {
  return FacturesData.factureSummary();
}

export async function overdueFactures(): Promise<FacturesData.Facture[]> {
  return FacturesData.overdueFactures();
}
