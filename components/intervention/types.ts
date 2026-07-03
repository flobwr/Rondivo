import { Feather } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

export type InterventionStatus = 'planifiee' | 'enCours' | 'terminee' | 'annulee';

export type Priority = 'basse' | 'normale' | 'haute';

// 'pendant' exists for the future Avant/Pendant/Après tagging flow — not yet
// assignable from the UI, but PhotosCard and the gallery already render it
// correctly the day a category picker ships.
export type PhotoCategory = 'avant' | 'pendant' | 'apres' | 'document';

export type Equipment = {
  id: string;
  name: string;
  detail: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

export type Photo = {
  id: string;
  source: ImageSourcePropType;
  category?: PhotoCategory;
};

export type MaterialItem = {
  id: string;
  name: string;
  quantity: number;
  reference: string;
};

export type DocumentStatus = 'disponible' | 'aFaire' | 'aEnvoyer';

// Not rendered yet — read by the future document action sheet (partager /
// télécharger / ouvrir) so it can be added without touching DocumentsCard.
export type DocumentAction = 'share' | 'download' | 'open';

export type DocumentItem = {
  id: string;
  label: string;
  detail: string;
  status: DocumentStatus;
  statusLabel: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  availableActions?: DocumentAction[];
};

export type HistoryEntry = {
  id: string;
  date: string;
  type: string;
  status: string;
  // Optional — populated once the corresponding features ship (photo
  // archive, payment tracking, real time-on-site, technician assignment).
  technician?: string;
  durationLabel?: string;
  amountLabel?: string;
  photoCount?: number;
};

export type ReportItemId = 'notes' | 'voice' | 'checklist' | 'signature' | 'liveTime' | 'pdf';

export type ReportItem = {
  id: ReportItemId;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
  done: boolean;
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
  hasSignature: boolean;
  reportPdfReady: boolean;
  documents: DocumentItem[];
  history: HistoryEntry[];
};
