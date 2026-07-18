import { DocumentsTone } from '@/components/documents/palette';
import { Palette } from '@/theme';
import { daysSince } from './date-utils';
import { DocumentLine } from './lines';

export type DevisStatus = 'brouillon' | 'envoye' | 'vu' | 'accepte' | 'refuse' | 'expire';

export type Devis = {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  amount: number;
  issuedAt: string; // ISO date
  validUntil: string; // ISO date
  status: DevisStatus;
  interventionId?: string;
  lines?: DocumentLine[];
  notes?: string;
};

export const DEVIS_STATUS_META: Record<DevisStatus, { label: string; color: string; soft: string }> = {
  brouillon: { label: 'Brouillon', color: Palette.textSecondary, soft: Palette.cardMuted },
  envoye: { label: 'Envoyé', color: Palette.blue, soft: Palette.blueSoft },
  vu: { label: 'Vu', color: Palette.purple, soft: Palette.purpleSoft },
  accepte: { label: 'Accepté', color: Palette.greenInk, soft: Palette.greenSoft },
  refuse: { label: 'Refusé', color: DocumentsTone.red.color, soft: DocumentsTone.red.soft },
  expire: { label: 'Expiré', color: DocumentsTone.orange.color, soft: DocumentsTone.orange.soft },
};

export const DEVIS_STATUS_ORDER: DevisStatus[] = ['envoye', 'vu', 'expire', 'brouillon', 'accepte', 'refuse'];

export const MOCK_DEVIS: Devis[] = [
  {
    id: 'de-1',
    number: 'DE-2026-031',
    clientId: '12',
    clientName: 'Laura Simon',
    amount: 5200,
    issuedAt: '2026-06-10',
    validUntil: '2026-07-10',
    status: 'envoye',
    interventionId: 'int-de-1',
    lines: [
      { id: 'de-1-l1', label: 'Main d’œuvre — rénovation salle de bain', amount: 3400 },
      { id: 'de-1-l2', label: 'Fournitures et matériel', amount: 1800 },
    ],
    notes: 'Devis valable 30 jours, acompte de 30 % à la signature.',
  },
  {
    id: 'de-2',
    number: 'DE-2026-030',
    clientId: '13',
    clientName: 'Julien Petit',
    amount: 3100,
    issuedAt: '2026-06-15',
    validUntil: '2026-07-15',
    status: 'envoye',
    lines: [
      { id: 'de-2-l1', label: 'Main d’œuvre', amount: 2000 },
      { id: 'de-2-l2', label: 'Fournitures', amount: 1100 },
    ],
  },
  {
    id: 'de-3',
    number: 'DE-2026-029',
    clientId: '14',
    clientName: 'Manon Andre',
    amount: 2450,
    issuedAt: '2026-06-01',
    validUntil: '2026-07-01',
    status: 'vu',
    lines: [
      { id: 'de-3-l1', label: 'Main d’œuvre', amount: 1650 },
      { id: 'de-3-l2', label: 'Fournitures', amount: 800 },
    ],
  },
  {
    id: 'de-4',
    number: 'DE-2026-028',
    clientId: '1',
    clientName: 'Jean Dupont',
    amount: 1800,
    issuedAt: '2026-05-20',
    validUntil: '2026-06-19',
    status: 'expire',
    lines: [
      { id: 'de-4-l1', label: 'Main d’œuvre', amount: 1200 },
      { id: 'de-4-l2', label: 'Fournitures', amount: 600 },
    ],
  },
  {
    id: 'de-5',
    number: 'DE-2026-027',
    clientId: '2',
    clientName: 'Pierre Martin',
    amount: 6700,
    issuedAt: '2026-05-05',
    validUntil: '2026-06-04',
    status: 'accepte',
    interventionId: 'int-de-5',
    lines: [
      { id: 'de-5-l1', label: 'Main d’œuvre — installation climatisation', amount: 4200 },
      { id: 'de-5-l2', label: 'Fournitures et matériel', amount: 2500 },
    ],
    notes: 'Accepté par le client, intervention à planifier.',
  },
  {
    id: 'de-6',
    number: 'DE-2026-026',
    clientId: '3',
    clientName: 'Marie Bernard',
    amount: 980,
    issuedAt: '2026-04-28',
    validUntil: '2026-05-28',
    status: 'accepte',
    lines: [
      { id: 'de-6-l1', label: 'Main d’œuvre', amount: 680 },
      { id: 'de-6-l2', label: 'Fournitures', amount: 300 },
    ],
  },
  {
    id: 'de-7',
    number: 'DE-2026-025',
    clientId: '4',
    clientName: 'Sophie Laurent',
    amount: 2200,
    issuedAt: '2026-04-15',
    validUntil: '2026-05-15',
    status: 'refuse',
    lines: [
      { id: 'de-7-l1', label: 'Main d’œuvre', amount: 1500 },
      { id: 'de-7-l2', label: 'Fournitures', amount: 700 },
    ],
    notes: 'Client parti sur une autre offre.',
  },
  {
    id: 'de-8',
    number: 'DE-2026-024',
    clientId: '5',
    clientName: 'Anthony Collet',
    amount: 4300,
    issuedAt: '2026-06-28',
    validUntil: '2026-07-28',
    status: 'brouillon',
    lines: [
      { id: 'de-8-l1', label: 'Main d’œuvre', amount: 2900 },
      { id: 'de-8-l2', label: 'Fournitures', amount: 1400 },
    ],
  },
  {
    id: 'de-9',
    number: 'DE-2026-032',
    clientId: '6',
    clientName: 'Camille Roux',
    amount: 2750,
    issuedAt: '2026-06-05',
    validUntil: '2026-07-05',
    status: 'envoye',
    lines: [
      { id: 'de-9-l1', label: 'Main d’œuvre', amount: 1750 },
      { id: 'de-9-l2', label: 'Fournitures', amount: 1000 },
    ],
  },
];

export function devisCountsByStatus(): Record<DevisStatus, number> {
  const counts = { brouillon: 0, envoye: 0, vu: 0, accepte: 0, refuse: 0, expire: 0 } as Record<DevisStatus, number>;
  for (const d of MOCK_DEVIS) counts[d.status] += 1;
  return counts;
}

// A quote is considered "à relancer" once it's been sitting with the client
// (sent or viewed, no decision) for 5+ days — a real, checkable business rule
// rather than a guess.
const RELAUNCH_AFTER_DAYS = 5;

export function devisSummary(): { potentialAmount: number; toRelaunchCount: number; acceptanceRate: number | null } {
  let potentialAmount = 0;
  let toRelaunchCount = 0;
  let accepted = 0;
  let refused = 0;
  for (const d of MOCK_DEVIS) {
    if (d.status === 'brouillon' || d.status === 'envoye' || d.status === 'vu') potentialAmount += d.amount;
    if ((d.status === 'envoye' || d.status === 'vu') && daysSince(d.issuedAt) >= RELAUNCH_AFTER_DAYS) {
      toRelaunchCount += 1;
    }
    if (d.status === 'accepte') accepted += 1;
    if (d.status === 'refuse') refused += 1;
  }
  const decided = accepted + refused;
  const acceptanceRate = decided > 0 ? Math.round((accepted / decided) * 100) : null;
  return { potentialAmount, toRelaunchCount, acceptanceRate };
}

/** Quotes awaiting a decision whose validity ends within `withinDays`. */
export function expiringDevis(withinDays = 2): Devis[] {
  return MOCK_DEVIS.filter((d) => {
    if (d.status !== 'envoye' && d.status !== 'vu') return false;
    const daysLeft = -daysSince(d.validUntil);
    return daysLeft >= 0 && daysLeft <= withinDays;
  }).sort((a, b) => new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime());
}

export function getDevisById(id: string): Devis | undefined {
  return MOCK_DEVIS.find((d) => d.id === id);
}

function nextDevisId(): string {
  const maxN = MOCK_DEVIS.reduce((max, d) => Math.max(max, Number(d.id.replace('de-', '')) || 0), 0);
  return `de-${maxN + 1}`;
}

export type DevisInput = Omit<Devis, 'id'>;

export function createDevis(input: DevisInput): Devis {
  const devis: Devis = { id: nextDevisId(), ...input };
  MOCK_DEVIS.unshift(devis);
  return devis;
}

export function updateDevis(id: string, patch: Partial<DevisInput>): Devis | undefined {
  const devis = getDevisById(id);
  if (!devis) return undefined;
  Object.assign(devis, patch);
  return devis;
}

export function deleteDevis(id: string) {
  const index = MOCK_DEVIS.findIndex((d) => d.id === id);
  if (index !== -1) MOCK_DEVIS.splice(index, 1);
}
