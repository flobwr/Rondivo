import { Intervention, Photo } from './types';

// ── Mock data — replace with real data source ─────────────────────────────────

// Stand-ins for real captured/picked photos (none exist yet in this mock
// dataset) — swapped for `{ uri }` sources once photos come from the device.
const DEMO_SOURCES = [
  require('@/assets/images/partial-react-logo.png'),
  require('@/assets/images/react-logo.png'),
  require('@/assets/images/splash-icon.png'),
  require('@/assets/images/icon.png'),
];

function demoPhotos(count: number): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ph-${i}`,
    source: DEMO_SOURCES[i % DEMO_SOURCES.length],
    category: (['avant', 'avant', 'apres', 'document'] as const)[i % 4],
  }));
}

const DEFAULT_INTERVENTION: Intervention = {
  id: 'default',
  reference: '#INT-2026-0153',
  type: 'Installation chauffe-eau',
  status: 'planifiee',
  client: 'Jean Dupont',
  phone: '+33612345678',
  dateLabel: "Aujourd'hui",
  startTime: '09:00',
  endTime: '11:30',
  duration: '2h30',
  address: '12 Rue des Lilas, 59000 Lille',
  travelMinutes: 18,
  travelKm: 7.4,
  description:
    "Installation d'un chauffe-eau électrique 200L après remplacement de l'ancien modèle. Vérification de la sécurité et test complet.",
  notes: [
    'Accès par la cour arrière',
    'Prévoir matériel supplémentaire (raccords 3/4)',
    'Client souhaite la facture par email',
  ],
  priority: 'normale',
  equipment: [
    { id: 'eq-1', name: 'Chauffe-eau Atlantic 200L', detail: 'Installé le 15/03/2021 · EQP-2021-0087', icon: 'droplet' },
    { id: 'eq-2', name: 'Groupe de sécurité', detail: 'Installé le 15/03/2021 · EQP-2021-0088', icon: 'shield' },
  ],
  photos: demoPhotos(4),
  material: [
    { id: 'mat-1', name: 'Raccord laiton 3/4"', quantity: 2, reference: 'REF-4471' },
    { id: 'mat-2', name: 'Groupe de sécurité 7 bar', quantity: 1, reference: 'REF-2290' },
    { id: 'mat-3', name: 'Flexible inox 40cm', quantity: 2, reference: 'REF-1183' },
  ],
  reportNote: '',
  hasVoiceNote: false,
  checklist: { completed: 0, total: 6 },
  hasSignature: false,
  reportPdfReady: false,
  documents: [
    { id: 'doc-1', label: 'Devis', detail: 'DEV-2026-0128', status: 'disponible', statusLabel: 'Signé', icon: 'file-text' },
    { id: 'doc-2', label: 'Facture', detail: 'Non créée', status: 'aFaire', statusLabel: 'À facturer', icon: 'file' },
    { id: 'doc-3', label: 'Rapport PDF', detail: 'Généré après intervention', status: 'aFaire', statusLabel: 'En attente', icon: 'file-plus' },
    { id: 'doc-4', label: "Bon d'intervention", detail: 'Signé sur site', status: 'aFaire', statusLabel: 'À signer', icon: 'edit-3' },
  ],
  history: [
    {
      id: 'h-1',
      date: '22 févr. 2025',
      type: 'Entretien annuel chaudière',
      status: 'Terminée',
      technician: 'Florian B.',
      durationLabel: '1h20',
      amountLabel: '89 €',
    },
    {
      id: 'h-2',
      date: '08 sept. 2023',
      type: 'Dépannage fuite radiateur',
      status: 'Terminée',
      technician: 'Florian B.',
      durationLabel: '0h45',
      amountLabel: '65 €',
      photoCount: 3,
    },
    { id: 'h-3', date: '15 mars 2021', type: 'Installation chauffe-eau (ancien modèle)', status: 'Terminée' },
  ],
};

const INTERVENTIONS: Record<string, Intervention> = {
  'apt-2': {
    ...DEFAULT_INTERVENTION,
    id: 'apt-2',
    reference: '#INT-2026-0161',
    type: 'Fuite sous évier',
    status: 'enCours',
    client: 'Sophie Bernard',
    dateLabel: "Aujourd'hui",
    startTime: '10:30',
    endTime: '12:00',
    duration: '1h30',
    address: '8 rue Molière, 69003 Lyon',
    travelMinutes: 12,
    travelKm: 4.2,
    description: "Fuite constatée sous l'évier de la cuisine. Remplacement du siphon et vérification des raccords.",
    priority: 'haute',
    photos: demoPhotos(1),
  },
  'apt-4': {
    ...DEFAULT_INTERVENTION,
    id: 'apt-4',
    reference: '#INT-2026-0164',
    type: 'Tableau électrique',
    status: 'planifiee',
    client: 'Marie Lefebvre',
    dateLabel: "Aujourd'hui",
    startTime: '16:00',
    endTime: '17:30',
    duration: '1h30',
    address: '3 place Bellecour, 69002 Lyon',
    travelMinutes: 7,
    travelKm: 2.3,
    description: 'Mise aux normes du tableau électrique suite au diagnostic de sécurité.',
    priority: 'haute',
    photos: [],
  },
  '1': {
    ...DEFAULT_INTERVENTION,
    id: '1',
    reference: '#INT-2026-0170',
    type: 'Pose de radiateur',
    status: 'planifiee',
    client: 'Sophie Bernard',
    dateLabel: "Aujourd'hui",
    startTime: '13:00',
    endTime: '14:30',
    duration: '1h30',
    address: '8 rue Molière, 69003 Lyon',
    travelMinutes: 12,
    travelKm: 4.2,
    photos: demoPhotos(2),
  },
  '2': {
    ...DEFAULT_INTERVENTION,
    id: '2',
    reference: '#INT-2026-0171',
    type: 'Dépannage urgence',
    status: 'planifiee',
    client: 'Marc Petit',
    dateLabel: "Aujourd'hui",
    startTime: '15:30',
    endTime: '16:30',
    duration: '1h00',
    address: '42 cours Vitton, 69006 Lyon',
    travelMinutes: 15,
    travelKm: 5.8,
    priority: 'haute',
  },
};

export function getIntervention(id?: string): Intervention {
  if (!id) return DEFAULT_INTERVENTION;
  return INTERVENTIONS[id] ?? { ...DEFAULT_INTERVENTION, id };
}
