import { DocumentsTone } from '@/components/documents/palette';
import { Palette } from '@/constants/design';

export type RapportStatus = 'aCompleter' | 'enCours' | 'termine' | 'pdfGenere';

export type ChecklistItem = { id: string; label: string; done: boolean };

export type Rapport = {
  id: string;
  number: string;
  interventionId: string;
  interventionLabel: string;
  clientId: string;
  clientName: string;
  date: string; // ISO
  status: RapportStatus;
  notes?: string;
  photosCount: number;
  checklist: ChecklistItem[];
  materialUsed: { id: string; name: string; quantity: number }[];
  timeSpentMinutes: number;
  signed: boolean;
};

export const RAPPORT_STATUS_META: Record<RapportStatus, { label: string; color: string; soft: string }> = {
  aCompleter: { label: 'À compléter', color: DocumentsTone.orange.color, soft: DocumentsTone.orange.soft },
  enCours: { label: 'En cours', color: Palette.blue, soft: Palette.blueSoft },
  termine: { label: 'Terminé', color: Palette.green, soft: Palette.greenSoft },
  pdfGenere: { label: 'PDF généré', color: Palette.purple, soft: Palette.purpleSoft },
};

export const RAPPORT_STATUS_ORDER: RapportStatus[] = ['aCompleter', 'enCours', 'termine', 'pdfGenere'];

export const MOCK_RAPPORTS: Rapport[] = [
  {
    id: 'ra-1',
    number: 'RA-2026-041',
    interventionId: 'int-ra-1',
    interventionLabel: 'Remplacement chauffe-eau',
    clientId: '6',
    clientName: 'Camille Roux',
    date: '2026-07-01',
    status: 'aCompleter',
    photosCount: 4,
    checklist: [
      { id: 'c-1', label: 'Dépose ancien appareil', done: true },
      { id: 'c-2', label: 'Installation nouveau chauffe-eau', done: true },
      { id: 'c-3', label: 'Test étanchéité', done: false },
      { id: 'c-4', label: 'Signature client', done: false },
    ],
    materialUsed: [{ id: 'm-1', name: 'Chauffe-eau Atlantic 200L', quantity: 1 }],
    timeSpentMinutes: 150,
    signed: false,
  },
  {
    id: 'ra-2',
    number: 'RA-2026-040',
    interventionId: 'int-ra-2',
    interventionLabel: 'Réparation fuite',
    clientId: '7',
    clientName: 'Nicolas Girard',
    date: '2026-06-30',
    status: 'enCours',
    photosCount: 2,
    checklist: [
      { id: 'c-5', label: 'Diagnostic fuite', done: true },
      { id: 'c-6', label: 'Remplacement joint', done: true },
      { id: 'c-7', label: 'Notes finales', done: false },
    ],
    materialUsed: [{ id: 'm-2', name: 'Joint fibre 3/4"', quantity: 3 }],
    timeSpentMinutes: 75,
    signed: false,
  },
  {
    id: 'ra-3',
    number: 'RA-2026-039',
    interventionId: 'int-ra-3',
    interventionLabel: 'Entretien chaudière',
    clientId: '8',
    clientName: 'Julie Fontaine',
    date: '2026-06-20',
    status: 'termine',
    notes: 'Chaudière en bon état général, filtre remplacé.',
    photosCount: 5,
    checklist: [
      { id: 'c-8', label: 'Nettoyage brûleur', done: true },
      { id: 'c-9', label: 'Contrôle pression', done: true },
      { id: 'c-10', label: 'Remplacement filtre', done: true },
    ],
    materialUsed: [{ id: 'm-3', name: 'Filtre à gaz', quantity: 1 }],
    timeSpentMinutes: 60,
    signed: true,
  },
  {
    id: 'ra-4',
    number: 'RA-2026-038',
    interventionId: 'int-ra-4',
    interventionLabel: 'Installation adoucisseur',
    clientId: '9',
    clientName: 'Thomas Lefevre',
    date: '2026-06-12',
    status: 'pdfGenere',
    notes: 'Installation conforme, mise en service validée avec le client.',
    photosCount: 6,
    checklist: [
      { id: 'c-11', label: 'Installation adoucisseur', done: true },
      { id: 'c-12', label: 'Réglage dureté eau', done: true },
      { id: 'c-13', label: 'Signature client', done: true },
    ],
    materialUsed: [{ id: 'm-4', name: 'Adoucisseur BWT 20L', quantity: 1 }],
    timeSpentMinutes: 180,
    signed: true,
  },
  {
    id: 'ra-5',
    number: 'RA-2026-037',
    interventionId: 'int-ra-5',
    interventionLabel: 'Dépannage évier bouché',
    clientId: '10',
    clientName: 'Emilie Moreau',
    date: '2026-06-05',
    status: 'pdfGenere',
    photosCount: 1,
    checklist: [
      { id: 'c-14', label: 'Débouchage siphon', done: true },
      { id: 'c-15', label: 'Test écoulement', done: true },
    ],
    materialUsed: [],
    timeSpentMinutes: 40,
    signed: true,
  },
];

export function rapportCountsByStatus(): Record<RapportStatus, number> {
  const counts = { aCompleter: 0, enCours: 0, termine: 0, pdfGenere: 0 } as Record<RapportStatus, number>;
  for (const r of MOCK_RAPPORTS) counts[r.status] += 1;
  return counts;
}

export function rapportSummary(): { toCompleteCount: number; pdfGeneratedCount: number } {
  let toCompleteCount = 0;
  let pdfGeneratedCount = 0;
  for (const r of MOCK_RAPPORTS) {
    if (r.status === 'aCompleter' || r.status === 'enCours') toCompleteCount += 1;
    if (r.status === 'pdfGenere') pdfGeneratedCount += 1;
  }
  return { toCompleteCount, pdfGeneratedCount };
}

/** Reports still needing work, oldest first — feeds "À traiter". */
export function rapportsToComplete(): Rapport[] {
  return MOCK_RAPPORTS.filter((r) => r.status === 'aCompleter').sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
