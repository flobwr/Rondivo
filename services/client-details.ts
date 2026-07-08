/**
 * Async facade over `data/client-details.ts` — the pure derivation layer that
 * builds a client's "fiche" view-model (contacts, equipment, documents,
 * activity, stats…) from a base `Client`. Screens should only ever import
 * from here; when a backend lands, only the bodies below (and
 * `data/client-details.ts` itself) change.
 */
import { type Client } from '@/components/clients/types';
import * as ClientDetailsData from '@/data/client-details';

export type {
  ClientType,
  StatsPeriod,
  ContactPerson,
  Equipment,
  DocumentCategory,
  ClientDocument,
  ActivityKind,
  ActivityEntry,
  ClientStatsData,
  NextAppointment,
  ClientAccess,
  FinanceItem,
  ClientFinances,
  InterventionItem,
  ClientDetail,
  AlertSeverity,
  ClientAlert,
} from '@/data/client-details';

export { DOCUMENT_CATEGORIES, formatEuro, formatEuroShort } from '@/data/client-details';

export async function getClientDetail(client: Client): Promise<ClientDetailsData.ClientDetail> {
  return ClientDetailsData.getClientDetail(client);
}

export async function getClientAlerts(
  client: Client,
  detail: ClientDetailsData.ClientDetail
): Promise<ClientDetailsData.ClientAlert[]> {
  return ClientDetailsData.getClientAlerts(client, detail);
}

export async function setClientDetailOverride(
  id: string,
  partial: Partial<ClientDetailsData.ClientDetail>
): Promise<void> {
  ClientDetailsData.setClientDetailOverride(id, partial);
}
