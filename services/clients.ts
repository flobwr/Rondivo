/**
 * `data/clients.ts` is already the most "Supabase-ready" file in the app: a
 * real paginated async fetch (`fetchClientsPage`) plus pure, framework-free
 * query helpers. This facade just re-exports it as-is, so screens import from
 * `@/services/clients` instead of `@/data/clients` — when the backend lands,
 * only the bodies inside `data/clients.ts` change, not this file, not the
 * import paths.
 */
export {
  fetchClientsPage,
  paginateClients,
  queryClients,
  countByStatus,
  getClientById,
  computeInitials,
  tintForName,
  createClient,
} from '@/data/clients';

export type { ClientQuery, ClientsPage, CreateClientInput } from '@/data/clients';
export type { Client } from '@/components/clients/types';
