import { Feather } from '@expo/vector-icons';

export type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export type Tone = 'red' | 'orange';

export type ModuleId = 'factures' | 'devis' | 'rapports' | 'photos' | 'contrats' | 'imports';

export type DocumentModule = {
  id: ModuleId;
  title: string;
  icon: FeatherIconName;
  count: number;
  unit: string; // e.g. "documents", "rapports", "photos", "contrats"
  highlight?: { text: string; tone: Tone }; // e.g. "3 impayées"
  secondary?: string; // e.g. "12 540 € en attente"
  /** Sub-module route, once built. `undefined` = not built yet (inert). */
  route?: string;
};

export type ActionItem = {
  id: string;
  moduleId: ModuleId;
  icon: FeatherIconName;
  text: string;
  tone: Tone;
};
