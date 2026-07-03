import { Feather } from '@expo/vector-icons';

export type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export type Tone = 'red' | 'orange';

export type ModuleId = 'factures' | 'devis' | 'rapports' | 'photos' | 'contrats' | 'imports';

/** A single stat line on a primary module card, e.g. "3 impayées" (dot-marked) or a plain amount. */
export type ModuleStat = {
  text: string;
  tone?: Tone;
};

export type DocumentModule = {
  id: ModuleId;
  title: string;
  icon: FeatherIconName;
  /** Primary modules (Factures, Devis, Rapports): 1-2 meaningful stat lines, no raw document count. */
  stats?: ModuleStat[];
  /** Secondary modules (Photos, Contrats, Imports): a plain count instead of stats. */
  count?: number;
  unit?: string;
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
