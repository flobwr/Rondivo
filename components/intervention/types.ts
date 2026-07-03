import { Feather } from '@expo/vector-icons';

export type InterventionStatus = 'planifiee' | 'enCours' | 'terminee' | 'annulee';

export type Priority = 'basse' | 'normale' | 'haute';

export type PhotoCategory = 'avant' | 'apres' | 'document';

export type Equipment = {
  id: string;
  name: string;
  detail: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

export type Photo = {
  id: string;
  category: PhotoCategory;
};

export type MaterialItem = {
  id: string;
  name: string;
  quantity: number;
  reference: string;
};

export type DocumentStatus = 'disponible' | 'aFaire' | 'aEnvoyer';

export type DocumentItem = {
  id: string;
  label: string;
  detail: string;
  status: DocumentStatus;
  statusLabel: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

export type HistoryEntry = {
  id: string;
  date: string;
  type: string;
  status: string;
};

export type Intervention = {
  id: string;
  reference: string;
  type: string;
  status: InterventionStatus;
  client: string;
  phone: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  duration: string;
  address: string;
  travelMinutes: number;
  travelKm: number;
  description: string;
  notes: string[];
  priority: Priority;
  equipment: Equipment[];
  photos: Photo[];
  material: MaterialItem[];
  reportNote: string;
  hasVoiceNote: boolean;
  checklist: { completed: number; total: number };
  documents: DocumentItem[];
  history: HistoryEntry[];
};
