import { DocumentsTone } from '@/components/documents/palette';
import { Palette } from '@/constants/design';
import { daysSince } from './date-utils';
import { DocumentLine } from './lines';

export type FactureStatus = 'brouillon' | 'envoyee' | 'payee' | 'enRetard' | 'annulee';

export type PaymentMethod = 'virement' | 'carte' | 'especes' | 'cheque' | 'prelevement';

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  virement: 'Virement',
  carte: 'Carte bancaire',
  especes: 'Espèces',
  cheque: 'Chèque',
  prelevement: 'Prélèvement',
};

// A facture can be settled through several partial payments — the UI (and
// this shape) already supports that, even though every mock invoice below
// happens to be paid in one go.
export type Payment = {
  id: string;
  date: string; // ISO date
  amount: number;
  method: PaymentMethod;
};

export type Facture = {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  amount: number;
  issuedAt: string; // ISO date
  dueAt: string; // ISO date
  status: FactureStatus;
  method?: PaymentMethod;
  interventionId?: string;
  payments: Payment[];
  lines?: DocumentLine[];
  notes?: string;
};

export const FACTURE_STATUS_META: Record<FactureStatus, { label: string; color: string; soft: string }> = {
  brouillon: { label: 'Brouillon', color: Palette.textSecondary, soft: Palette.cardMuted },
  envoyee: { label: 'Envoyée', color: Palette.blue, soft: Palette.blueSoft },
  payee: { label: 'Payée', color: Palette.green, soft: Palette.greenSoft },
  enRetard: { label: 'En retard', color: DocumentsTone.red.color, soft: DocumentsTone.red.soft },
  annulee: { label: 'Annulée', color: Palette.textTertiary, soft: Palette.cardMuted },
};

export const FACTURE_STATUS_ORDER: FactureStatus[] = ['enRetard', 'envoyee', 'brouillon', 'payee', 'annulee'];

export const MOCK_FACTURES: Facture[] = [
  {
    id: 'fa-1',
    number: 'FA-2026-014',
    clientId: '1',
    clientName: 'Jean Dupont',
    amount: 4820,
    issuedAt: '2026-05-28',
    dueAt: '2026-06-27',
    status: 'enRetard',
    interventionId: 'int-1',
    payments: [],
    lines: [
      { id: 'fa-1-l1', label: 'Main d’œuvre — remplacement chaudière', amount: 3200 },
      { id: 'fa-1-l2', label: 'Fournitures et pièces', amount: 1620 },
    ],
    notes: 'Remplacement complet de la chaudière suite à panne. Garantie pièces 2 ans.',
  },
  {
    id: 'fa-2',
    number: 'FA-2026-013',
    clientId: '2',
    clientName: 'Pierre Martin',
    amount: 3200,
    issuedAt: '2026-06-02',
    dueAt: '2026-07-02',
    status: 'enRetard',
    interventionId: 'int-2',
    payments: [],
    lines: [
      { id: 'fa-2-l1', label: 'Main d’œuvre — réparation fuite', amount: 2000 },
      { id: 'fa-2-l2', label: 'Fournitures et pièces', amount: 1200 },
    ],
    notes: 'Intervention en urgence le week-end.',
  },
  {
    id: 'fa-3',
    number: 'FA-2026-012',
    clientId: '3',
    clientName: 'Marie Bernard',
    amount: 4520,
    issuedAt: '2026-05-24',
    dueAt: '2026-06-23',
    status: 'enRetard',
    interventionId: 'int-3',
    payments: [],
    lines: [
      { id: 'fa-3-l1', label: 'Main d’œuvre — installation', amount: 2800 },
      { id: 'fa-3-l2', label: 'Fournitures et pièces', amount: 1720 },
    ],
  },
  {
    id: 'fa-4',
    number: 'FA-2026-011',
    clientId: '4',
    clientName: 'Sophie Laurent',
    amount: 1180,
    issuedAt: '2026-06-18',
    dueAt: '2026-07-18',
    status: 'envoyee',
    interventionId: 'int-4',
    payments: [],
    lines: [
      { id: 'fa-4-l1', label: 'Main d’œuvre', amount: 780 },
      { id: 'fa-4-l2', label: 'Fournitures', amount: 400 },
    ],
  },
  {
    id: 'fa-5',
    number: 'FA-2026-010',
    clientId: '5',
    clientName: 'Anthony Collet',
    amount: 2650,
    issuedAt: '2026-06-20',
    dueAt: '2026-07-20',
    status: 'envoyee',
    payments: [],
    lines: [
      { id: 'fa-5-l1', label: 'Main d’œuvre', amount: 1650 },
      { id: 'fa-5-l2', label: 'Fournitures', amount: 1000 },
    ],
  },
  {
    id: 'fa-6',
    number: 'FA-2026-009',
    clientId: '6',
    clientName: 'Camille Roux',
    amount: 6400,
    issuedAt: '2026-05-14',
    dueAt: '2026-06-13',
    status: 'payee',
    method: 'virement',
    interventionId: 'int-6',
    payments: [{ id: 'pay-1', date: '2026-06-05', amount: 6400, method: 'virement' }],
    lines: [
      { id: 'fa-6-l1', label: 'Main d’œuvre — remplacement chauffe-eau', amount: 4200 },
      { id: 'fa-6-l2', label: 'Fournitures et pièces', amount: 2200 },
    ],
    notes: 'Chauffe-eau 200L installé, ancien appareil évacué.',
  },
  {
    id: 'fa-7',
    number: 'FA-2026-008',
    clientId: '7',
    clientName: 'Nicolas Girard',
    amount: 980,
    issuedAt: '2026-05-10',
    dueAt: '2026-06-09',
    status: 'payee',
    method: 'carte',
    payments: [{ id: 'pay-2', date: '2026-05-15', amount: 980, method: 'carte' }],
    lines: [
      { id: 'fa-7-l1', label: 'Main d’œuvre', amount: 780 },
      { id: 'fa-7-l2', label: 'Fournitures', amount: 200 },
    ],
  },
  {
    id: 'fa-8',
    number: 'FA-2026-007',
    clientId: '8',
    clientName: 'Julie Fontaine',
    amount: 8900,
    issuedAt: '2026-04-30',
    dueAt: '2026-05-30',
    status: 'payee',
    method: 'virement',
    payments: [
      { id: 'pay-3', date: '2026-05-10', amount: 4000, method: 'virement' },
      { id: 'pay-4', date: '2026-05-28', amount: 4900, method: 'virement' },
    ],
    lines: [
      { id: 'fa-8-l1', label: 'Main d’œuvre — entretien annuel', amount: 5400 },
      { id: 'fa-8-l2', label: 'Fournitures et pièces', amount: 3500 },
    ],
    notes: 'Contrat d’entretien annuel — 2 passages inclus.',
  },
  {
    id: 'fa-9',
    number: 'FA-2026-006',
    clientId: '9',
    clientName: 'Thomas Lefevre',
    amount: 1520,
    issuedAt: '2026-04-22',
    dueAt: '2026-05-22',
    status: 'payee',
    method: 'cheque',
    payments: [{ id: 'pay-5', date: '2026-05-02', amount: 1520, method: 'cheque' }],
    lines: [
      { id: 'fa-9-l1', label: 'Main d’œuvre', amount: 1020 },
      { id: 'fa-9-l2', label: 'Fournitures', amount: 500 },
    ],
  },
  {
    id: 'fa-10',
    number: 'FA-2026-005',
    clientId: '10',
    clientName: 'Emilie Moreau',
    amount: 640,
    issuedAt: '2026-06-25',
    dueAt: '2026-07-25',
    status: 'brouillon',
    payments: [],
    lines: [
      { id: 'fa-10-l1', label: 'Main d’œuvre', amount: 440 },
      { id: 'fa-10-l2', label: 'Fournitures', amount: 200 },
    ],
  },
  {
    id: 'fa-11',
    number: 'FA-2026-004',
    clientId: '11',
    clientName: 'Alexandre Dubois',
    amount: 2100,
    issuedAt: '2026-04-02',
    dueAt: '2026-05-02',
    status: 'annulee',
    payments: [],
    lines: [
      { id: 'fa-11-l1', label: 'Main d’œuvre', amount: 1400 },
      { id: 'fa-11-l2', label: 'Fournitures', amount: 700 },
    ],
    notes: 'Facture annulée — devis remplacé par une nouvelle intervention.',
  },
];

export function factureCountsByStatus(): Record<FactureStatus, number> {
  const counts = { brouillon: 0, envoyee: 0, payee: 0, enRetard: 0, annulee: 0 } as Record<FactureStatus, number>;
  for (const f of MOCK_FACTURES) counts[f.status] += 1;
  return counts;
}

export function factureSummary(): { toCollect: number; overdueAmount: number; overdueCount: number } {
  let toCollect = 0;
  let overdueAmount = 0;
  let overdueCount = 0;
  for (const f of MOCK_FACTURES) {
    if (f.status === 'enRetard') {
      overdueAmount += f.amount;
      overdueCount += 1;
      toCollect += f.amount;
    } else if (f.status === 'envoyee' || f.status === 'brouillon') {
      toCollect += f.amount;
    }
  }
  return { toCollect, overdueAmount, overdueCount };
}

/** Overdue invoices, most late first — feeds the "À traiter" recommendations. */
export function overdueFactures(): Facture[] {
  return MOCK_FACTURES.filter((f) => f.status === 'enRetard').sort(
    (a, b) => daysSince(b.dueAt) - daysSince(a.dueAt)
  );
}
