import { DocumentsTone } from '@/components/documents/palette';
import { Palette } from '@/constants/design';

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
  signe: { label: 'Signé', color: Palette.green, soft: Palette.greenSoft },
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
];

export function contratCountsByStatus(): Record<ContratStatus, number> {
  const counts = { brouillon: 0, enAttenteSignature: 0, signe: 0, expire: 0 } as Record<ContratStatus, number>;
  for (const c of MOCK_CONTRATS) counts[c.status] += 1;
  return counts;
}
