/**
 * Async facade over `data/documents/search.ts` — the global "one search box
 * across every module" query. Awaits the other documents services (never the
 * raw `data/documents/*` arrays) for every document type; clients are looked
 * up via the plain client dataset the same way the Clients module itself
 * does today (client search/listing is outside the Documents module's own
 * services surface).
 */
import { FeatherIconName } from '@/components/documents/types';
import { CLIENTS } from '@/data/clients';
import { formatAmount, formatShortDate } from '@/data/documents/date-utils';
import { listContrats } from './contrats';
import { listDevis } from './devis';
import { listFactures } from './factures';
import { listImports } from './imports';
import { listPhotoInterventions } from './photos';
import { listRapports } from './rapports';
import { CONTRAT_STATUS_META } from '@/data/documents/contrats';
import { DEVIS_STATUS_META } from '@/data/documents/devis';
import { FACTURE_STATUS_META } from '@/data/documents/factures';
import { RAPPORT_STATUS_META } from '@/data/documents/rapports';

export type SearchResultType = 'client' | 'facture' | 'devis' | 'rapport' | 'contrat' | 'photo' | 'import';

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  route: string;
};

export const SEARCH_TYPE_LABEL: Record<SearchResultType, string> = {
  client: 'Clients',
  facture: 'Factures',
  devis: 'Devis',
  rapport: 'Rapports',
  contrat: 'Contrats',
  photo: 'Photos',
  import: 'Documents importés',
};

export const SEARCH_TYPE_ICON: Record<SearchResultType, FeatherIconName> = {
  client: 'user',
  facture: 'file-text',
  devis: 'edit-3',
  rapport: 'clipboard',
  contrat: 'briefcase',
  photo: 'camera',
  import: 'folder',
};

// One global search across every module — a client name, an invoice number,
// an intervention label all resolve through the same query, each result
// routing straight to its detail screen.
export async function searchAll(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [factures, devis, rapports, contrats, photos, imports] = await Promise.all([
    listFactures(),
    listDevis(),
    listRapports(),
    listContrats(),
    listPhotoInterventions(),
    listImports(),
  ]);

  const results: SearchResult[] = [];

  for (const c of CLIENTS) {
    if (
      c.name.toLowerCase().includes(q) ||
      c.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
      c.address.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    ) {
      results.push({ id: `client-${c.id}`, type: 'client', title: c.name, subtitle: c.address, route: `/client/${c.id}` });
    }
  }

  for (const f of factures) {
    if (f.number.toLowerCase().includes(q) || f.clientName.toLowerCase().includes(q)) {
      results.push({
        id: `facture-${f.id}`,
        type: 'facture',
        title: `${f.number} · ${formatAmount(f.amount)}`,
        subtitle: `${f.clientName} · ${FACTURE_STATUS_META[f.status].label}`,
        route: `/facture/${f.id}`,
      });
    }
  }

  for (const d of devis) {
    if (d.number.toLowerCase().includes(q) || d.clientName.toLowerCase().includes(q)) {
      results.push({
        id: `devis-${d.id}`,
        type: 'devis',
        title: `${d.number} · ${formatAmount(d.amount)}`,
        subtitle: `${d.clientName} · ${DEVIS_STATUS_META[d.status].label}`,
        route: `/devis/${d.id}`,
      });
    }
  }

  for (const r of rapports) {
    if (
      r.number.toLowerCase().includes(q) ||
      r.clientName.toLowerCase().includes(q) ||
      r.interventionLabel.toLowerCase().includes(q)
    ) {
      results.push({
        id: `rapport-${r.id}`,
        type: 'rapport',
        title: r.interventionLabel,
        subtitle: `${r.clientName} · ${RAPPORT_STATUS_META[r.status].label}`,
        route: `/rapport/${r.id}`,
      });
    }
  }

  for (const c of contrats) {
    if (c.number.toLowerCase().includes(q) || c.clientName.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) {
      results.push({
        id: `contrat-${c.id}`,
        type: 'contrat',
        title: c.title,
        subtitle: `${c.clientName} · ${CONTRAT_STATUS_META[c.status].label}`,
        route: `/contrat/${c.id}`,
      });
    }
  }

  for (const p of photos) {
    if (p.label.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q)) {
      results.push({
        id: `photo-${p.id}`,
        type: 'photo',
        title: p.label,
        subtitle: `${p.clientName} · ${p.photos.length} photos`,
        route: `/photos/${p.id}`,
      });
    }
  }

  for (const f of imports) {
    if (f.name.toLowerCase().includes(q) || f.clientName?.toLowerCase().includes(q)) {
      results.push({
        id: `import-${f.id}`,
        type: 'import',
        title: f.name,
        subtitle: f.clientName ? `${f.clientName} · ${formatShortDate(f.date)}` : formatShortDate(f.date),
        route: '/documents-importes',
      });
    }
  }

  return results;
}
