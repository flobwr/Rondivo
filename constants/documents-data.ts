/**
 * Fictional data backing the Documents module (dashboard + Factures, Devis,
 * Rapports, Contrats, Photos, Documents importés). Centralised here so every
 * screen reads the same numbers — the dashboard stats are derived from these
 * arrays instead of being retyped by hand.
 */

import { formatEuro } from './format';

// ── Types ─────────────────────────────────────────────────────────────────────

export type InvoiceStatus = 'Brouillon' | 'Envoyée' | 'En retard' | 'Payée';

export type Invoice = {
  id: string;
  number: string;
  client: string;
  status: InvoiceStatus;
  amount: number;
  dueDate: string; // display label, e.g. "25 juil."
  overdueDays?: number;
  intervention?: string;
};

export type QuoteStatus = 'Brouillon' | 'Envoyé' | 'Vu' | 'Accepté' | 'Refusé' | 'Expiré';

export type Quote = {
  id: string;
  number: string;
  client: string;
  status: QuoteStatus;
  amount: number;
  validUntil: string; // display label
  expiresToday?: boolean;
  intervention?: string;
};

export type ReportStatus = 'À compléter' | 'En cours' | 'Terminé' | 'PDF généré';

export type Report = {
  id: string;
  title: string;
  client: string;
  date: string;
  status: ReportStatus;
  intervention?: string;
};

export type ContractStatus = 'Brouillon' | 'En attente de signature' | 'Signé' | 'Expiré';

export type Contract = {
  id: string;
  title: string;
  client: string;
  since: string; // display label
  status: ContractStatus;
  expiringInDays?: number; // set when Signé and close to expiry
};

export type PhotoIntervention = {
  id: string;
  title: string;
  client: string;
  date: string;
  before: number;
  during: number;
  after: number;
};

export type ImportedDocKind = 'PDF' | 'Image' | 'Document';

export type ImportedDoc = {
  id: string;
  name: string;
  kind: ImportedDocKind;
  size: string;
  date: string;
  client?: string;
  intervention?: string;
};

// ── Invoices (Factures) ───────────────────────────────────────────────────────

export const INVOICES: Invoice[] = [
  { id: 'fa-005', number: 'FA-2026-005', client: 'Emilie Moreau', status: 'Brouillon', amount: 640, dueDate: '25 juil.' },
  { id: 'fa-010', number: 'FA-2026-010', client: 'Anthony Collet', status: 'Envoyée', amount: 2650, dueDate: '20 juil.' },
  { id: 'fa-011', number: 'FA-2026-011', client: 'Sophie Laurent', status: 'Envoyée', amount: 1180, dueDate: '18 juil.' },
  { id: 'fa-013', number: 'FA-2026-013', client: 'Pierre Martin', status: 'En retard', amount: 3200, dueDate: '2 juil.', overdueDays: 3 },
  { id: 'fa-014', number: 'FA-2026-014', client: 'Jean Dupont', status: 'En retard', amount: 4820, dueDate: '27 juin', overdueDays: 8 },
  { id: 'fa-012', number: 'FA-2026-012', client: 'Marie Bernard', status: 'En retard', amount: 4520, dueDate: '23 juin', overdueDays: 12 },
  { id: 'fa-009', number: 'FA-2026-009', client: 'Julie Fontaine', status: 'Payée', amount: 1980, dueDate: '15 juin' },
  { id: 'fa-008', number: 'FA-2026-008', client: 'Nicolas Girard', status: 'Payée', amount: 2340, dueDate: '10 juin' },
  { id: 'fa-007', number: 'FA-2026-007', client: 'Camille Roux', status: 'Payée', amount: 1560, dueDate: '2 juin' },
  { id: 'fa-006', number: 'FA-2026-006', client: 'Thomas Lefevre', status: 'Payée', amount: 2100, dueDate: '28 mai' },
  { id: 'fa-004', number: 'FA-2026-004', client: 'Alexandre Dubois', status: 'Payée', amount: 1860, dueDate: '15 mai' },
];

export const invoiceStats = {
  total: INVOICES.length,
  collected: INVOICES.filter((i) => i.status === 'Payée').reduce((s, i) => s + i.amount, 0),
  outstanding: INVOICES.filter((i) => i.status !== 'Payée').reduce((s, i) => s + i.amount, 0),
  pendingAmount: INVOICES.filter((i) => i.status === 'Brouillon' || i.status === 'Envoyée').reduce(
    (s, i) => s + i.amount,
    0
  ),
  overdueCount: INVOICES.filter((i) => i.status === 'En retard').length,
  overdueAmount: INVOICES.filter((i) => i.status === 'En retard').reduce((s, i) => s + i.amount, 0),
};

// ── Quotes (Devis) ────────────────────────────────────────────────────────────

export const QUOTES: Quote[] = [
  { id: 'de-024', number: 'DE-2026-024', client: 'Anthony Collet', status: 'Brouillon', amount: 4300, validUntil: '28 juil.' },
  { id: 'de-030', number: 'DE-2026-030', client: 'Julien Petit', status: 'Envoyé', amount: 3100, validUntil: '15 juil.' },
  { id: 'de-031', number: 'DE-2026-031', client: 'Laura Simon', status: 'Envoyé', amount: 5200, validUntil: '10 juil.' },
  { id: 'de-032', number: 'DE-2026-032', client: 'Camille Roux', status: 'Envoyé', amount: 2750, validUntil: "5 juil.", expiresToday: true, intervention: 'Remplacement chauffe-eau' },
  { id: 'de-029', number: 'DE-2026-029', client: 'Manon Andre', status: 'Vu', amount: 2450, validUntil: '1 juil.' },
  { id: 'de-028', number: 'DE-2026-028', client: 'Jean Dupont', status: 'Expiré', amount: 1800, validUntil: '19 juin' },
  { id: 'de-027', number: 'DE-2026-027', client: 'Pierre Martin', status: 'Accepté', amount: 2400, validUntil: '15 juin' },
  { id: 'de-026', number: 'DE-2026-026', client: 'Nicolas Girard', status: 'Accepté', amount: 3600, validUntil: '10 juin' },
  { id: 'de-025', number: 'DE-2026-025', client: 'Marie Bernard', status: 'Refusé', amount: 1900, validUntil: '5 juin' },
];

const decidedQuotes = QUOTES.filter((q) => q.status === 'Accepté' || q.status === 'Refusé');
const pendingQuotes = QUOTES.filter((q) => q.status === 'Brouillon' || q.status === 'Envoyé' || q.status === 'Vu');

export const quoteStats = {
  total: QUOTES.length,
  potential: pendingQuotes.reduce((s, q) => s + q.amount, 0),
  acceptanceRate: Math.round(
    (QUOTES.filter((q) => q.status === 'Accepté').length / decidedQuotes.length) * 100
  ),
  toFollowUp: QUOTES.filter((q) => q.status === 'Envoyé' || q.status === 'Vu').length,
  expiringThisWeek: QUOTES.filter((q) => q.status === 'Envoyé' || q.status === 'Vu').length, // same pool, within 7j validity window in this mock
};

// ── Reports (Rapports) ────────────────────────────────────────────────────────

export const REPORTS: Report[] = [
  { id: 'rp-1', title: 'Remplacement chauffe-eau', client: 'Camille Roux', date: '1 juil.', status: 'À compléter' },
  { id: 'rp-2', title: 'Réparation fuite', client: 'Nicolas Girard', date: '30 juin', status: 'En cours' },
  { id: 'rp-3', title: 'Entretien chaudière', client: 'Julie Fontaine', date: '20 juin', status: 'Terminé' },
  { id: 'rp-4', title: 'Installation adoucisseur', client: 'Thomas Lefevre', date: '12 juin', status: 'PDF généré' },
  { id: 'rp-5', title: 'Dépannage évier bouché', client: 'Emilie Moreau', date: '5 juin', status: 'PDF généré' },
];

export const reportStats = {
  total: REPORTS.length,
  toComplete: REPORTS.filter((r) => r.status === 'À compléter' || r.status === 'En cours').length,
  inProgress: REPORTS.filter((r) => r.status === 'En cours').length,
  pdfGenerated: REPORTS.filter((r) => r.status === 'PDF généré').length,
};

// ── Contracts (Contrats) ──────────────────────────────────────────────────────

export const CONTRACTS: Contract[] = [
  { id: 'ct-1', title: 'Contrat de dépannage prioritaire', client: 'Marie Bernard', since: '25 juin', status: 'Brouillon' },
  { id: 'ct-2', title: 'Contrat de maintenance annuelle', client: 'Alexandre Dubois', since: '20 juin', status: 'En attente de signature' },
  { id: 'ct-3', title: 'Contrat d’entretien chaudière', client: 'Julie Fontaine', since: '1 janv.', status: 'Signé' },
  { id: 'ct-4', title: 'Contrat d’entretien climatisation', client: 'Sophie Laurent', since: '9 juil. 2025', status: 'Signé', expiringInDays: 4 },
  { id: 'ct-5', title: 'Contrat d’entretien climatisation', client: 'Camille Roux', since: '1 mars', status: 'Expiré' },
];

export const contractStats = {
  total: CONTRACTS.length,
  active: CONTRACTS.filter((c) => c.status === 'Signé').length,
  expiringSoon: CONTRACTS.filter((c) => c.status === 'Signé' && (c.expiringInDays ?? Infinity) <= 30).length,
  toRenew: CONTRACTS.filter((c) => c.status === 'Signé' && (c.expiringInDays ?? Infinity) <= 30).length,
  expired: CONTRACTS.filter((c) => c.status === 'Expiré').length,
};

// ── Photos ────────────────────────────────────────────────────────────────────

export const PHOTO_INTERVENTIONS: PhotoIntervention[] = [
  {
    id: 'ph-1',
    title: 'Remplacement chauffe-eau',
    client: 'Camille Roux',
    date: '1 juil.',
    before: 3,
    during: 5,
    after: 4,
  },
  {
    id: 'ph-2',
    title: 'Réparation fuite',
    client: 'Nicolas Girard',
    date: '30 juin',
    before: 2,
    during: 3,
    after: 2,
  },
  {
    id: 'ph-3',
    title: 'Entretien chaudière',
    client: 'Julie Fontaine',
    date: '20 juin',
    before: 2,
    during: 2,
    after: 2,
  },
  {
    id: 'ph-4',
    title: 'Installation adoucisseur',
    client: 'Thomas Lefevre',
    date: '12 juin',
    before: 1,
    during: 1,
    after: 1,
  },
  {
    id: 'ph-5',
    title: 'Dépannage évier bouché',
    client: 'Emilie Moreau',
    date: '5 juin',
    before: 1,
    during: 1,
    after: 1,
  },
];

export const photoStats = {
  interventions: PHOTO_INTERVENTIONS.length,
  totalPhotos: PHOTO_INTERVENTIONS.reduce((s, p) => s + p.before + p.during + p.after, 0),
};

// ── Imported documents ────────────────────────────────────────────────────────

export const IMPORTED_DOCS: ImportedDoc[] = [
  { id: 'doc-1', name: 'Devis fournisseur - Chauffe-eau.pdf', kind: 'PDF', size: '340 Ko', date: '28 juin', client: 'Camille Roux', intervention: 'Remplacement chauffe-eau' },
  { id: 'doc-2', name: 'Attestation assurance décennale.pdf', kind: 'PDF', size: '512 Ko', date: '20 juin' },
  { id: 'doc-3', name: 'Plan chaufferie.jpg', kind: 'Image', size: '1.8 Mo', date: '18 juin', client: 'Julie Fontaine' },
  { id: 'doc-4', name: 'Bon de garantie adoucisseur.pdf', kind: 'PDF', size: '210 Ko', date: '12 juin', client: 'Thomas Lefevre', intervention: 'Installation adoucisseur' },
  { id: 'doc-5', name: 'Notice technique BWT.doc', kind: 'Document', size: '95 Ko', date: '9 juin' },
  { id: 'doc-6', name: 'Facture fournisseur - Pièces sanitaires.pdf', kind: 'PDF', size: '180 Ko', date: '8 juin' },
  { id: 'doc-7', name: 'Photo tableau électrique.jpg', kind: 'Image', size: '2.1 Mo', date: '2 juin', client: 'Marie Bernard' },
];

export const importedDocStats = {
  total: IMPORTED_DOCS.length,
  pdf: IMPORTED_DOCS.filter((d) => d.kind === 'PDF').length,
  images: IMPORTED_DOCS.filter((d) => d.kind === 'Image').length,
  documents: IMPORTED_DOCS.filter((d) => d.kind === 'Document').length,
};

// ── Clients & interventions (creation forms) ─────────────────────────────────

export type ClientOption = { id: string; name: string };

export const MOCK_CLIENTS: ClientOption[] = [
  { id: 'cl-1', name: 'Camille Roux' },
  { id: 'cl-2', name: 'Sophie Laurent' },
  { id: 'cl-3', name: 'Pierre Martin' },
  { id: 'cl-4', name: 'Jean Dupont' },
  { id: 'cl-5', name: 'Marie Bernard' },
  { id: 'cl-6', name: 'Anthony Collet' },
  { id: 'cl-7', name: 'Julien Petit' },
  { id: 'cl-8', name: 'Laura Simon' },
  { id: 'cl-9', name: 'Manon Andre' },
  { id: 'cl-10', name: 'Alexandre Dubois' },
  { id: 'cl-11', name: 'Julie Fontaine' },
  { id: 'cl-12', name: 'Thomas Lefevre' },
  { id: 'cl-13', name: 'Nicolas Girard' },
  { id: 'cl-14', name: 'Emilie Moreau' },
];

export type InterventionOption = {
  id: string;
  title: string;
  client: string;
  suggestedAmount: number;
  suggestedLines: { description: string; qty: string; unitPrice: string }[];
};

export const MOCK_INTERVENTIONS: InterventionOption[] = [
  {
    id: 'int-1',
    title: 'Remplacement chauffe-eau',
    client: 'Camille Roux',
    suggestedAmount: 2750,
    suggestedLines: [
      { description: 'Chauffe-eau 200L + fournitures', qty: '1', unitPrice: '1950' },
      { description: "Main d'œuvre installation", qty: '4', unitPrice: '200' },
    ],
  },
  {
    id: 'int-2',
    title: 'Réparation fuite',
    client: 'Nicolas Girard',
    suggestedAmount: 380,
    suggestedLines: [
      { description: "Main d'œuvre — réparation fuite", qty: '2', unitPrice: '150' },
      { description: 'Raccords et joints', qty: '1', unitPrice: '80' },
    ],
  },
  {
    id: 'int-3',
    title: 'Entretien chaudière',
    client: 'Julie Fontaine',
    suggestedAmount: 190,
    suggestedLines: [{ description: 'Entretien annuel chaudière', qty: '1', unitPrice: '190' }],
  },
  {
    id: 'int-4',
    title: 'Installation adoucisseur',
    client: 'Thomas Lefevre',
    suggestedAmount: 1450,
    suggestedLines: [
      { description: 'Adoucisseur d’eau', qty: '1', unitPrice: '1100' },
      { description: "Main d'œuvre installation", qty: '2', unitPrice: '175' },
    ],
  },
  {
    id: 'int-5',
    title: 'Dépannage évier bouché',
    client: 'Emilie Moreau',
    suggestedAmount: 150,
    suggestedLines: [{ description: "Main d'œuvre — débouchage évier", qty: '1', unitPrice: '150' }],
  },
];

// ── "À traiter" — dashboard priority actions ──────────────────────────────────

export type ActionItem = {
  id: string;
  icon: 'invoice' | 'quote' | 'report' | 'contract';
  tone: 'red' | 'amber';
  title: string;
  route: string;
  params?: Record<string, string>;
};

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'act-1',
    icon: 'invoice',
    tone: 'red',
    title: `${invoiceStats.overdueCount} factures impayées · ${formatEuro(invoiceStats.overdueAmount)} en retard`,
    route: '/documents/factures',
    params: { filter: 'late' },
  },
  {
    id: 'act-2',
    icon: 'quote',
    tone: 'red',
    title: 'Devis DE-2026-032 expire aujourd’hui',
    route: '/documents/devis',
    params: { highlight: 'de-032' },
  },
  {
    id: 'act-3',
    icon: 'report',
    tone: 'amber',
    title: 'Rapport "Remplacement chauffe-eau" à terminer',
    route: '/documents/rapports',
    params: { highlight: 'rp-1' },
  },
  {
    id: 'act-4',
    icon: 'contract',
    tone: 'amber',
    title: 'Contrat d’entretien climatisation expire dans 4 jours',
    route: '/documents/contrats',
    params: { highlight: 'ct-4' },
  },
];
