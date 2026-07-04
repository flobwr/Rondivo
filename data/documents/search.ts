import { FeatherIconName } from '@/components/documents/types';
import { CLIENTS } from '@/data/clients';
import { formatAmount, formatShortDate } from './date-utils';
import { FACTURE_STATUS_META, MOCK_FACTURES } from './factures';
import { DEVIS_STATUS_META, MOCK_DEVIS } from './devis';
import { RAPPORT_STATUS_META, MOCK_RAPPORTS } from './rapports';
import { CONTRAT_STATUS_META, MOCK_CONTRATS } from './contrats';
import { MOCK_IMPORTS } from './imports';
import { PHOTO_INTERVENTIONS } from './photos';

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
export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

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

  for (const f of MOCK_FACTURES) {
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

  for (const d of MOCK_DEVIS) {
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

  for (const r of MOCK_RAPPORTS) {
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

  for (const c of MOCK_CONTRATS) {
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

  for (const p of PHOTO_INTERVENTIONS) {
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

  for (const f of MOCK_IMPORTS) {
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
