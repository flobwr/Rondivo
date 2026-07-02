import {
  type Client,
  type ClientStatus,
  type SortKey,
} from '@/components/clients/types';

/**
 * Mocked client dataset.
 *
 * The screen never touches this array directly — it goes through
 * {@link fetchClientsPage}, a stand-in for a paginated Supabase query. When the
 * backend lands, only that function (and {@link getClientById}) needs to change;
 * every filter/sort/pagination call site stays identical.
 */
export const CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    initials: 'JD',
    avatarTint: 'blue',
    phone: '06 45 67 89 01',
    address: 'Rue de Mons 24, 69003 Lyon',
    email: 'jean.dupont@email.com',
    status: 'action-required',
    priority: 0,
    highlightText: '1 facture impayée',
    highlightTint: 'red',
    highlightIcon: 'alert-circle',
    lastInterventionLabel: 'il y a 12 jours',
    lastInterventionDaysAgo: 12,
    interventionsCount: 8,
    quotesPending: 2,
    revenue: 4200,
    unpaidInvoices: 1,
    footerIcon: 'check-circle',
    footerText: 'Client fidèle depuis 2022',
    footerTint: 'green',
    clientSince: '2022',
    createdAt: '2022-03-14',
  },
  {
    id: '2',
    name: 'Pierre Martin',
    initials: 'PM',
    avatarTint: 'orange',
    phone: '06 12 34 56 78',
    address: '12 rue Victor Hugo, 69002 Lyon',
    email: 'pierre.martin@email.com',
    status: 'follow-up',
    priority: 1,
    highlightText: 'Devis envoyé il y a 9 jours',
    highlightTint: 'orange',
    highlightIcon: 'file-text',
    lastInterventionLabel: 'il y a 26 jours',
    lastInterventionDaysAgo: 26,
    interventionsCount: 5,
    quotesPending: 1,
    revenue: 3100,
    unpaidInvoices: 0,
    footerIcon: 'clock',
    footerText: 'Répond sous 3 à 7 jours',
    footerTint: 'orange',
    clientSince: '2023',
    createdAt: '2023-01-20',
  },
  {
    id: '3',
    name: 'Marie Bernard',
    initials: 'MB',
    avatarTint: 'green',
    phone: '06 98 76 54 32',
    address: '3 place Bellecour, 69002 Lyon',
    email: 'marie.bernard@email.com',
    status: 'up-to-date',
    priority: 3,
    highlightText: 'Dernière intervention : hier',
    highlightTint: 'green',
    highlightIcon: 'check-circle',
    lastInterventionLabel: 'hier',
    lastInterventionDaysAgo: 1,
    interventionsCount: 12,
    quotesPending: 0,
    revenue: 9800,
    unpaidInvoices: 0,
    footerIcon: 'check-circle',
    footerText: 'Excellente relation client',
    footerTint: 'green',
    clientSince: '2022',
    createdAt: '2022-05-02',
  },
  {
    id: '4',
    name: 'Sophie Laurent',
    initials: 'SL',
    avatarTint: 'orange',
    phone: '06 23 45 67 89',
    address: '45 av. Félix Faure, 69003 Lyon',
    email: 'sophie.laurent@email.com',
    status: 'follow-up',
    priority: 1,
    highlightText: 'Devis en attente il y a 16 jours',
    highlightTint: 'orange',
    highlightIcon: 'file-text',
    lastInterventionLabel: 'il y a 2 mois',
    lastInterventionDaysAgo: 60,
    interventionsCount: 3,
    quotesPending: 1,
    revenue: 1500,
    unpaidInvoices: 0,
    footerIcon: 'clock',
    footerText: 'Relance recommandée',
    footerTint: 'orange',
    clientSince: '2024',
    createdAt: '2024-02-11',
  },
  {
    id: '5',
    name: 'Anthony Collet',
    initials: 'AC',
    avatarTint: 'blue',
    phone: '06 34 56 78 90',
    address: '8 rue de la République, 69001 Lyon',
    email: 'anthony.collet@email.com',
    status: 'new',
    priority: 2,
    highlightText: 'Premier contact',
    highlightTint: 'blue',
    highlightIcon: 'user-plus',
    lastInterventionLabel: 'aucune',
    lastInterventionDaysAgo: 9999,
    interventionsCount: 0,
    quotesPending: 0,
    revenue: 0,
    unpaidInvoices: 0,
    footerIcon: 'user-plus',
    footerText: 'Ajouté le 08/06/2025',
    footerTint: 'blue',
    clientSince: '2025',
    createdAt: '2025-06-08',
  },
  {
    id: '6',
    name: 'Camille Roux',
    initials: 'CR',
    avatarTint: 'purple',
    phone: '06 56 78 90 12',
    address: '17 quai Saint-Antoine, 69002 Lyon',
    email: 'camille.roux@email.com',
    status: 'up-to-date',
    priority: 3,
    highlightText: 'Toutes les factures payées',
    highlightTint: 'green',
    highlightIcon: 'check-circle',
    lastInterventionLabel: 'il y a 8 jours',
    lastInterventionDaysAgo: 8,
    interventionsCount: 6,
    quotesPending: 0,
    revenue: 5600,
    unpaidInvoices: 0,
    footerIcon: 'check-circle',
    footerText: 'Client fidèle depuis 2021',
    footerTint: 'green',
    clientSince: '2021',
    createdAt: '2021-09-30',
  },
  {
    id: '7',
    name: 'Nicolas Girard',
    initials: 'NG',
    avatarTint: 'red',
    phone: '06 67 89 01 23',
    address: '29 rue Garibaldi, 69006 Lyon',
    email: 'nicolas.girard@email.com',
    status: 'action-required',
    priority: 0,
    highlightText: '2 factures impayées',
    highlightTint: 'red',
    highlightIcon: 'alert-circle',
    lastInterventionLabel: 'il y a 34 jours',
    lastInterventionDaysAgo: 34,
    interventionsCount: 4,
    quotesPending: 0,
    revenue: 3800,
    unpaidInvoices: 2,
    footerIcon: 'alert-circle',
    footerText: 'Paiement en retard',
    footerTint: 'red',
    clientSince: '2023',
    createdAt: '2023-11-05',
  },
  {
    id: '8',
    name: 'Julie Fontaine',
    initials: 'JF',
    avatarTint: 'green',
    phone: '06 78 90 12 34',
    address: '5 cours Lafayette, 69003 Lyon',
    email: 'julie.fontaine@email.com',
    status: 'up-to-date',
    priority: 3,
    highlightText: 'Dernière intervention : il y a 3 jours',
    highlightTint: 'green',
    highlightIcon: 'check-circle',
    lastInterventionLabel: 'il y a 3 jours',
    lastInterventionDaysAgo: 3,
    interventionsCount: 9,
    quotesPending: 0,
    revenue: 7300,
    unpaidInvoices: 0,
    footerIcon: 'check-circle',
    footerText: 'Client fidèle depuis 2020',
    footerTint: 'green',
    clientSince: '2020',
    createdAt: '2020-07-18',
  },
  {
    id: '9',
    name: 'Thomas Lefevre',
    initials: 'TL',
    avatarTint: 'blue',
    phone: '06 89 01 23 45',
    address: '61 rue de Marseille, 69007 Lyon',
    email: 'thomas.lefevre@email.com',
    status: 'new',
    priority: 2,
    highlightText: 'Premier contact',
    highlightTint: 'blue',
    highlightIcon: 'user-plus',
    lastInterventionLabel: 'aucune',
    lastInterventionDaysAgo: 9999,
    interventionsCount: 0,
    quotesPending: 1,
    revenue: 0,
    unpaidInvoices: 0,
    footerIcon: 'user-plus',
    footerText: 'Ajouté le 21/06/2025',
    footerTint: 'blue',
    clientSince: '2025',
    createdAt: '2025-06-21',
  },
  {
    id: '10',
    name: 'Emilie Moreau',
    initials: 'EM',
    avatarTint: 'purple',
    phone: '06 90 12 34 56',
    address: '14 montée de la Grande Côte, 69001 Lyon',
    email: 'emilie.moreau@email.com',
    status: 'follow-up',
    priority: 1,
    highlightText: 'Devis envoyé il y a 5 jours',
    highlightTint: 'orange',
    highlightIcon: 'file-text',
    lastInterventionLabel: 'il y a 40 jours',
    lastInterventionDaysAgo: 40,
    interventionsCount: 2,
    quotesPending: 1,
    revenue: 1200,
    unpaidInvoices: 0,
    footerIcon: 'clock',
    footerText: 'Répond généralement vite',
    footerTint: 'orange',
    clientSince: '2024',
    createdAt: '2024-09-02',
  },
  {
    id: '11',
    name: 'Alexandre Dubois',
    initials: 'AD',
    avatarTint: 'green',
    phone: '06 01 23 45 67',
    address: '2 place des Terreaux, 69001 Lyon',
    email: 'alexandre.dubois@email.com',
    status: 'up-to-date',
    priority: 3,
    highlightText: 'Dernière intervention : il y a 6 jours',
    highlightTint: 'green',
    highlightIcon: 'check-circle',
    lastInterventionLabel: 'il y a 6 jours',
    lastInterventionDaysAgo: 6,
    interventionsCount: 15,
    quotesPending: 0,
    revenue: 12400,
    unpaidInvoices: 0,
    footerIcon: 'check-circle',
    footerText: 'Client fidèle depuis 2019',
    footerTint: 'green',
    clientSince: '2019',
    createdAt: '2019-04-27',
  },
  {
    id: '12',
    name: 'Laura Simon',
    initials: 'LS',
    avatarTint: 'red',
    phone: '06 11 22 33 44',
    address: '77 rue Duguesclin, 69006 Lyon',
    email: 'laura.simon@email.com',
    status: 'action-required',
    priority: 0,
    highlightText: '1 facture impayée',
    highlightTint: 'red',
    highlightIcon: 'alert-circle',
    lastInterventionLabel: 'il y a 21 jours',
    lastInterventionDaysAgo: 21,
    interventionsCount: 7,
    quotesPending: 0,
    revenue: 5100,
    unpaidInvoices: 1,
    footerIcon: 'alert-circle',
    footerText: 'Échéance dépassée',
    footerTint: 'red',
    clientSince: '2022',
    createdAt: '2022-10-12',
  },
  {
    id: '13',
    name: 'Julien Petit',
    initials: 'JP',
    avatarTint: 'blue',
    phone: '06 22 33 44 55',
    address: '9 rue Childebert, 69002 Lyon',
    email: 'julien.petit@email.com',
    status: 'up-to-date',
    priority: 3,
    highlightText: 'Toutes les factures payées',
    highlightTint: 'green',
    highlightIcon: 'check-circle',
    lastInterventionLabel: 'il y a 15 jours',
    lastInterventionDaysAgo: 15,
    interventionsCount: 10,
    quotesPending: 0,
    revenue: 8600,
    unpaidInvoices: 0,
    footerIcon: 'check-circle',
    footerText: 'Client fidèle depuis 2023',
    footerTint: 'green',
    clientSince: '2023',
    createdAt: '2023-02-08',
  },
  {
    id: '14',
    name: 'Manon Andre',
    initials: 'MA',
    avatarTint: 'orange',
    phone: '06 33 44 55 66',
    address: '31 grande rue de la Guillotière, 69007 Lyon',
    email: 'manon.andre@email.com',
    status: 'follow-up',
    priority: 1,
    highlightText: 'Devis en attente il y a 11 jours',
    highlightTint: 'orange',
    highlightIcon: 'file-text',
    lastInterventionLabel: 'il y a 50 jours',
    lastInterventionDaysAgo: 50,
    interventionsCount: 4,
    quotesPending: 1,
    revenue: 2400,
    unpaidInvoices: 0,
    footerIcon: 'clock',
    footerText: 'Relance recommandée',
    footerTint: 'orange',
    clientSince: '2024',
    createdAt: '2024-04-19',
  },
];

// ── Query layer (server-style) ─────────────────────────────────────────────
// Everything below mimics what a backend endpoint would do: filter, sort and
// paginate. It is intentionally pure + framework-free so it can be lifted into
// an edge function or a React Query `queryFn` unchanged.

export type ClientQuery = {
  search: string;
  statuses: ClientStatus[];
  sort: SortKey;
};

export const CLIENTS_PAGE_SIZE = 6;

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function matchesSearch(client: Client, query: string) {
  if (!query) return true;
  const q = normalize(query);
  return [client.name, client.phone, client.address, client.email, client.company ?? '']
    .some((field) => normalize(field).includes(q));
}

const COMPARATORS: Record<SortKey, (a: Client, b: Client) => number> = {
  priority: (a, b) => a.priority - b.priority || a.lastInterventionDaysAgo - b.lastInterventionDaysAgo,
  name: (a, b) => a.name.localeCompare(b.name, 'fr'),
  recent: (a, b) => a.lastInterventionDaysAgo - b.lastInterventionDaysAgo,
  created: (a, b) => b.createdAt.localeCompare(a.createdAt),
  interventions: (a, b) => b.interventionsCount - a.interventionsCount,
  revenue: (a, b) => b.revenue - a.revenue,
  unpaid: (a, b) => b.unpaidInvoices - a.unpaidInvoices || a.priority - b.priority,
};

/** Pure filter + sort. Returns the full result set (no pagination). */
export function queryClients(query: ClientQuery, source: Client[] = CLIENTS): Client[] {
  const filtered = source.filter(
    (client) =>
      matchesSearch(client, query.search) &&
      (query.statuses.length === 0 || query.statuses.includes(client.status))
  );
  return filtered.sort(COMPARATORS[query.sort]);
}

/** Count of clients per status across the whole dataset (drives the stat cards). */
export function countByStatus(source: Client[] = CLIENTS): Record<ClientStatus, number> {
  const result: Record<ClientStatus, number> = {
    'action-required': 0,
    'follow-up': 0,
    'up-to-date': 0,
    new: 0,
  };
  for (const client of source) result[client.status] += 1;
  return result;
}

export type ClientsPage = {
  items: Client[];
  page: number;
  total: number;
  hasMore: boolean;
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Pure, synchronous slice of {@link queryClients} — no artificial latency.
 * Filtering/sorting an already-loaded local dataset is instant; only the very
 * first load and pull-to-refresh should look like a real network round trip.
 */
export function paginateClients(query: ClientQuery, page: number): ClientsPage {
  const all = queryClients(query);
  const start = (page - 1) * CLIENTS_PAGE_SIZE;
  const items = all.slice(start, start + CLIENTS_PAGE_SIZE);
  return {
    items,
    page,
    total: all.length,
    hasMore: start + CLIENTS_PAGE_SIZE < all.length,
  };
}

/**
 * Mocked paginated fetch. Swap the body for a Supabase `.range()` query and the
 * rest of the app keeps working. `shouldFail` lets the UI exercise its error
 * state on demand.
 */
export async function fetchClientsPage(
  query: ClientQuery,
  page: number,
  { shouldFail = false, delay = page === 1 ? 650 : 500 }: { shouldFail?: boolean; delay?: number } = {}
): Promise<ClientsPage> {
  await wait(delay);
  if (shouldFail) throw new Error('network');
  return paginateClients(query, page);
}

export function getClientById(id: string): Client | undefined {
  return CLIENTS.find((client) => client.id === id);
}
