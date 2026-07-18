import { DocumentsTone } from '@/components/documents/palette';
import { Palette } from '@/theme';
import { daysSince } from './date-utils';

export type ContratStatus = 'brouillon' | 'enAttenteSignature' | 'signe' | 'expire';

export type Contrat = {
  id: string;
  number: string;
  title: string;
  clientId: string;
  clientName: string;
  startDate: string; // ISO
  endDate?: string; // ISO
  status: ContratStatus;
};

export const CONTRAT_STATUS_META: Record<ContratStatus, { label: string; color: string; soft: string }> = {
  brouillon: { label: 'Brouillon', color: Palette.textSecondary, soft: Palette.cardMuted },
  enAttenteSignature: { label: 'En attente de signature', color: DocumentsTone.orange.color, soft: DocumentsTone.orange.soft },
  signe: { label: 'Signé', color: Palette.greenInk, soft: Palette.greenSoft },
  expire: { label: 'Expiré', color: Palette.textTertiary, soft: Palette.cardMuted },
};

export const CONTRAT_STATUS_ORDER: ContratStatus[] = ['enAttenteSignature', 'brouillon', 'signe', 'expire'];

export const MOCK_CONTRATS: Contrat[] = [
  {
    id: 'co-1',
    number: 'CO-2026-004',
    title: 'Contrat d’entretien chaudière',
    clientId: '8',
    clientName: 'Julie Fontaine',
    startDate: '2026-01-01',
    endDate: '2027-01-01',
    status: 'signe',
  },
  {
    id: 'co-2',
    number: 'CO-2026-005',
    title: 'Contrat de maintenance annuelle',
    clientId: '11',
    clientName: 'Alexandre Dubois',
    startDate: '2026-06-15',
    status: 'enAttenteSignature',
  },
  {
    id: 'co-3',
    number: 'CO-2026-006',
    title: 'Contrat de dépannage prioritaire',
    clientId: '3',
    clientName: 'Marie Bernard',
    startDate: '2026-06-25',
    status: 'brouillon',
  },
  {
    id: 'co-4',
    number: 'CO-2025-018',
    title: 'Contrat d’entretien climatisation',
    clientId: '6',
    clientName: 'Camille Roux',
    startDate: '2025-03-01',
    endDate: '2026-03-01',
    status: 'expire',
  },
  {
    id: 'co-5',
    number: 'CO-2025-019',
    title: 'Contrat d’entretien climatisation',
    clientId: '4',
    clientName: 'Sophie Laurent',
    startDate: '2025-07-09',
    endDate: '2026-07-09',
    status: 'signe',
  },
];

export function contratCountsByStatus(): Record<ContratStatus, number> {
  const counts = { brouillon: 0, enAttenteSignature: 0, signe: 0, expire: 0 } as Record<ContratStatus, number>;
  for (const c of MOCK_CONTRATS) counts[c.status] += 1;
  return counts;
}

const EXPIRING_SOON_WITHIN_DAYS = 14;

export function contratSummary(): { activeCount: number; expiringSoonCount: number; pendingSignatureCount: number } {
  let activeCount = 0;
  let expiringSoonCount = 0;
  let pendingSignatureCount = 0;
  for (const c of MOCK_CONTRATS) {
    if (c.status === 'signe') {
      activeCount += 1;
      if (c.endDate && -daysSince(c.endDate) <= EXPIRING_SOON_WITHIN_DAYS && -daysSince(c.endDate) >= 0) {
        expiringSoonCount += 1;
      }
    }
    if (c.status === 'enAttenteSignature') pendingSignatureCount += 1;
  }
  return { activeCount, expiringSoonCount, pendingSignatureCount };
}

/** Signed contracts ending within `withinDays`, soonest first. */
export function expiringContrats(withinDays = EXPIRING_SOON_WITHIN_DAYS): Contrat[] {
  return MOCK_CONTRATS.filter((c) => {
    if (c.status !== 'signe' || !c.endDate) return false;
    const daysLeft = -daysSince(c.endDate);
    return daysLeft >= 0 && daysLeft <= withinDays;
  }).sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime());
}

export function getContratById(id: string): Contrat | undefined {
  return MOCK_CONTRATS.find((c) => c.id === id);
}

function nextContratId(): string {
  const maxN = MOCK_CONTRATS.reduce((max, c) => Math.max(max, Number(c.id.replace('co-', '')) || 0), 0);
  return `co-${maxN + 1}`;
}

export type ContratInput = Omit<Contrat, 'id'>;

export function createContrat(input: ContratInput): Contrat {
  const contrat: Contrat = { id: nextContratId(), ...input };
  MOCK_CONTRATS.unshift(contrat);
  return contrat;
}

export function updateContrat(id: string, patch: Partial<ContratInput>): Contrat | undefined {
  const contrat = getContratById(id);
  if (!contrat) return undefined;
  Object.assign(contrat, patch);
  return contrat;
}

export function deleteContrat(id: string) {
  const index = MOCK_CONTRATS.findIndex((c) => c.id === id);
  if (index !== -1) MOCK_CONTRATS.splice(index, 1);
}
