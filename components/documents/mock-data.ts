import type {
  ActionItem,
  Contract,
  ContractSummary,
  ImportedDocument,
  Invoice,
  InvoiceSummary,
  PhotoIntervention,
  Quote,
  QuoteSummary,
  Report,
  ReportSummary,
  SearchResult,
} from './types';

// ── Invoices ────────────────────────────────────────────────────────────────────

export const INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    reference: 'FA-2026-005',
    client: 'Emilie Moreau',
    amount: 640,
    status: 'draft',
    dueDate: '25 juil.',
  },
  {
    id: 'inv-2',
    reference: 'FA-2026-010',
    client: 'Anthony Collet',
    amount: 2650,
    status: 'sent',
    dueDate: '20 juil.',
  },
  {
    id: 'inv-3',
    reference: 'FA-2026-011',
    client: 'Sophie Laurent',
    amount: 1180,
    status: 'sent',
    dueDate: '18 juil.',
  },
  {
    id: 'inv-4',
    reference: 'FA-2026-013',
    client: 'Pierre Martin',
    amount: 3200,
    status: 'overdue',
    dueDate: '2 juil.',
    daysOverdue: 2,
  },
  {
    id: 'inv-5',
    reference: 'FA-2026-014',
    client: 'Jean Dupont',
    amount: 4820,
    status: 'overdue',
    dueDate: '27 juin',
    daysOverdue: 7,
  },
  {
    id: 'inv-6',
    reference: 'FA-2026-008',
    client: 'Marie Bernard',
    amount: 890,
    status: 'paid',
    dueDate: '15 juin',
  },
  {
    id: 'inv-7',
    reference: 'FA-2026-009',
    client: 'Lucas Petit',
    amount: 1450,
    status: 'paid',
    dueDate: '10 juin',
  },
  {
    id: 'inv-8',
    reference: 'FA-2026-007',
    client: 'Camille Roux',
    amount: 2100,
    status: 'sent',
    dueDate: '22 juil.',
  },
  {
    id: 'inv-9',
    reference: 'FA-2026-012',
    client: 'Nicolas Girard',
    amount: 760,
    status: 'overdue',
    dueDate: '25 juin',
    daysOverdue: 9,
  },
  {
    id: 'inv-10',
    reference: 'FA-2026-006',
    client: 'Thomas Lefevre',
    amount: 1900,
    status: 'paid',
    dueDate: '5 juin',
  },
  {
    id: 'inv-11',
    reference: 'FA-2026-004',
    client: 'Julie Fontaine',
    amount: 950,
    status: 'paid',
    dueDate: '1 juin',
  },
];

export const INVOICE_SUMMARY: InvoiceSummary = {
  totalToCollect: 12540,
  unpaidCount: 3,
  overdueAmount: 8780,
  overdueCount: 3,
};

// ── Quotes ──────────────────────────────────────────────────────────────────────

export const QUOTES: Quote[] = [
  {
    id: 'qt-1',
    reference: 'DE-2026-024',
    client: 'Anthony Collet',
    amount: 4300,
    status: 'draft',
    validUntil: '20 juil.',
  },
  {
    id: 'qt-2',
    reference: 'DE-2026-030',
    client: 'Julien Petit',
    amount: 3100,
    status: 'sent',
    validUntil: '15 juil.',
  },
  {
    id: 'qt-3',
    reference: 'DE-2026-031',
    client: 'Laura Simon',
    amount: 5200,
    status: 'sent',
    validUntil: '10 juil.',
  },
  {
    id: 'qt-4',
    reference: 'DE-2026-029',
    client: 'Manon Andre',
    amount: 2450,
    status: 'viewed',
    validUntil: '1 juil.',
  },
  {
    id: 'qt-5',
    reference: 'DE-2026-028',
    client: 'Jean Dupont',
    amount: 1800,
    status: 'expired',
    validUntil: '19 juin',
    daysUntilExpiry: -15,
  },
  {
    id: 'qt-6',
    reference: 'DE-2026-027',
    client: 'Pierre Martin',
    amount: 6700,
    status: 'accepted',
    validUntil: '25 juil.',
  },
  {
    id: 'qt-7',
    reference: 'DE-2026-026',
    client: 'Sophie Laurent',
    amount: 2900,
    status: 'accepted',
    validUntil: '20 juil.',
  },
  {
    id: 'qt-8',
    reference: 'DE-2026-025',
    client: 'Camille Roux',
    amount: 3800,
    status: 'sent',
    validUntil: '5 juil.',
    daysUntilExpiry: 1,
  },
];

export const QUOTE_SUMMARY: QuoteSummary = {
  potentialAmount: 18200,
  pendingCount: 5,
  acceptanceRate: 68,
  averageValue: 3781,
};

// ── Reports ─────────────────────────────────────────────────────────────────────

export const REPORTS: Report[] = [
  {
    id: 'rpt-1',
    title: 'Remplacement chauffe-eau',
    client: 'Camille Roux',
    date: '1 juil.',
    status: 'toComplete',
  },
  {
    id: 'rpt-2',
    title: 'Réparation fuite',
    client: 'Nicolas Girard',
    date: '30 juin',
    status: 'inProgress',
  },
  {
    id: 'rpt-3',
    title: 'Entretien chaudière',
    client: 'Julie Fontaine',
    date: '20 juin',
    status: 'completed',
  },
  {
    id: 'rpt-4',
    title: 'Installation adoucisseur',
    client: 'Thomas Lefevre',
    date: '12 juin',
    status: 'pdfGenerated',
  },
  {
    id: 'rpt-5',
    title: 'Dépannage évier bouché',
    client: 'Emilie Moreau',
    date: '5 juin',
    status: 'pdfGenerated',
  },
];

export const REPORT_SUMMARY: ReportSummary = {
  toCompleteCount: 2,
  completedTodayCount: 1,
  pdfGeneratedCount: 2,
};

// ── Contracts ───────────────────────────────────────────────────────────────────

export const CONTRACTS: Contract[] = [
  {
    id: 'ctr-1',
    title: 'Contrat de dépannage prioritaire',
    client: 'Marie Bernard',
    startDate: '25 juin',
    status: 'draft',
  },
  {
    id: 'ctr-2',
    title: 'Contrat de maintenance',
    client: 'Alexandre Dubois',
    startDate: '15 juin',
    status: 'pendingSignature',
  },
  {
    id: 'ctr-3',
    title: 'Contrat d\'entretien chaudière',
    client: 'Julie Fontaine',
    startDate: '1 janv.',
    status: 'signed',
  },
  {
    id: 'ctr-4',
    title: 'Contrat d\'entretien climatisation',
    client: 'Camille Roux',
    startDate: '1 mars',
    status: 'expired',
    daysUntilExpiry: -8,
  },
];

export const CONTRACT_SUMMARY: ContractSummary = {
  activeCount: 1,
  expiringSoonCount: 1,
  draftCount: 1,
};

// ── Photos (intervention-based) ─────────────────────────────────────────────────

export const PHOTO_INTERVENTIONS: PhotoIntervention[] = [
  {
    id: 'pi-1',
    title: 'Remplacement chaudière',
    client: 'Julie Fontaine',
    date: '20 juin',
    photos: [
      { id: 'p-1', phase: 'before', uri: 'placeholder' },
      { id: 'p-2', phase: 'before', uri: 'placeholder' },
      { id: 'p-3', phase: 'before', uri: 'placeholder' },
      { id: 'p-4', phase: 'during', uri: 'placeholder' },
      { id: 'p-5', phase: 'during', uri: 'placeholder' },
      { id: 'p-6', phase: 'during', uri: 'placeholder' },
      { id: 'p-7', phase: 'during', uri: 'placeholder' },
      { id: 'p-8', phase: 'during', uri: 'placeholder' },
      { id: 'p-9', phase: 'after', uri: 'placeholder' },
      { id: 'p-10', phase: 'after', uri: 'placeholder' },
      { id: 'p-11', phase: 'after', uri: 'placeholder' },
      { id: 'p-12', phase: 'after', uri: 'placeholder' },
    ],
  },
  {
    id: 'pi-2',
    title: 'Réparation fuite',
    client: 'Nicolas Girard',
    date: '30 juin',
    photos: [
      { id: 'p-13', phase: 'before', uri: 'placeholder' },
      { id: 'p-14', phase: 'before', uri: 'placeholder' },
      { id: 'p-15', phase: 'during', uri: 'placeholder' },
      { id: 'p-16', phase: 'during', uri: 'placeholder' },
      { id: 'p-17', phase: 'during', uri: 'placeholder' },
      { id: 'p-18', phase: 'after', uri: 'placeholder' },
      { id: 'p-19', phase: 'after', uri: 'placeholder' },
    ],
  },
  {
    id: 'pi-3',
    title: 'Installation adoucisseur',
    client: 'Thomas Lefevre',
    date: '12 juin',
    photos: [
      { id: 'p-20', phase: 'before', uri: 'placeholder' },
      { id: 'p-21', phase: 'during', uri: 'placeholder' },
      { id: 'p-22', phase: 'during', uri: 'placeholder' },
      { id: 'p-23', phase: 'after', uri: 'placeholder' },
      { id: 'p-24', phase: 'after', uri: 'placeholder' },
      { id: 'p-25', phase: 'after', uri: 'placeholder' },
    ],
  },
  {
    id: 'pi-4',
    title: 'Entretien chaudière',
    client: 'Martin Faure',
    date: '8 juin',
    photos: [
      { id: 'p-26', phase: 'before', uri: 'placeholder' },
      { id: 'p-27', phase: 'during', uri: 'placeholder' },
      { id: 'p-28', phase: 'after', uri: 'placeholder' },
    ],
  },
  {
    id: 'pi-5',
    title: 'Dépannage évier bouché',
    client: 'Emilie Moreau',
    date: '5 juin',
    photos: [
      { id: 'p-29', phase: 'before', uri: 'placeholder' },
      { id: 'p-30', phase: 'before', uri: 'placeholder' },
      { id: 'p-31', phase: 'during', uri: 'placeholder' },
      { id: 'p-32', phase: 'after', uri: 'placeholder' },
    ],
  },
];

// ── Imported Documents ──────────────────────────────────────────────────────────

export const IMPORTED_DOCUMENTS: ImportedDocument[] = [
  {
    id: 'imp-1',
    name: 'Devis fournisseur - Chauffe-eau',
    date: '28 juin',
    size: '340 Ko',
    type: 'pdf',
    client: 'Camille Roux',
  },
  {
    id: 'imp-2',
    name: 'Attestation assurance décennale',
    date: '20 juin',
    size: '512 Ko',
    type: 'pdf',
  },
  {
    id: 'imp-3',
    name: 'Plan chaufferie.jpg',
    date: '18 juin',
    size: '1.8 Mo',
    type: 'image',
    client: 'Julie Fontaine',
  },
  {
    id: 'imp-4',
    name: 'Bon de garantie adoucisseur',
    date: '12 juin',
    size: '210 Ko',
    type: 'pdf',
    client: 'Thomas Lefevre',
  },
  {
    id: 'imp-5',
    name: 'Notice technique BWT.doc',
    date: '30 mai',
    size: '95 Ko',
    type: 'word',
  },
  {
    id: 'imp-6',
    name: 'Photo compteur avant travaux',
    date: '22 mai',
    size: '980 Ko',
    type: 'image',
    client: 'Emilie Moreau',
  },
  {
    id: 'imp-7',
    name: 'Devis signé - Copropriété.pdf',
    date: '15 mai',
    size: '1.2 Mo',
    type: 'pdf',
    linkedTo: 'DE-2026-019',
  },
];

// ── Action Center ───────────────────────────────────────────────────────────────

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'act-1',
    type: 'invoice',
    title: '3 factures impayées',
    subtitle: '8 780 € en retard',
    urgency: 'high',
  },
  {
    id: 'act-2',
    type: 'quote',
    title: '2 devis à relancer',
    subtitle: 'Dernière relance il y a 5 jours',
    urgency: 'medium',
  },
  {
    id: 'act-3',
    type: 'report',
    title: '1 rapport à terminer',
    subtitle: 'Remplacement chauffe-eau',
    urgency: 'medium',
  },
  {
    id: 'act-4',
    type: 'contract',
    title: '1 contrat expire dans 5 jours',
    subtitle: 'Contrat d\'entretien climatisation',
    urgency: 'low',
  },
];

// ── Global Search Results (for demo) ────────────────────────────────────────────

export const SEARCH_RESULTS_DUPONT: SearchResult[] = [
  {
    id: 'sr-1',
    type: 'client',
    title: 'Jean Dupont',
    subtitle: 'Client depuis mars 2024',
  },
  {
    id: 'sr-2',
    type: 'invoice',
    title: 'FA-2026-014 · 4 820 €',
    subtitle: 'Facture · En retard depuis 7 jours',
  },
  {
    id: 'sr-3',
    type: 'quote',
    title: 'DE-2026-028 · 1 800 €',
    subtitle: 'Devis · Expiré',
  },
  {
    id: 'sr-4',
    type: 'report',
    title: 'Entretien chaudière',
    subtitle: 'Rapport · 20 juin',
  },
  {
    id: 'sr-5',
    type: 'intervention',
    title: 'Entretien chaudière',
    subtitle: 'Intervention · 20 juin · 12 photos',
  },
];
