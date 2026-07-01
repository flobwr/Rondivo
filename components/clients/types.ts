import { Feather } from '@expo/vector-icons';

import { Palette } from '@/constants/design';

export type ClientStatus = 'action-required' | 'follow-up' | 'up-to-date' | 'new';

/**
 * Every sort the filter menu exposes. Keeping the union here (rather than as
 * loose strings) means the sort menu, the comparator map and the persisted
 * preference all stay in sync at compile time.
 */
export type SortKey =
  | 'priority'
  | 'name'
  | 'recent'
  | 'created'
  | 'interventions'
  | 'revenue'
  | 'unpaid';

export type ViewMode = 'comfortable' | 'compact';

export type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export type Tint = 'blue' | 'orange' | 'purple' | 'green' | 'red';

export type Client = {
  id: string;
  name: string;
  initials: string;
  avatarTint: Tint;
  phone: string;
  address: string;
  email: string;
  company?: string;
  status: ClientStatus;
  priority: number; // lower sorts first
  highlightText: string;
  highlightTint: Tint;
  highlightIcon: FeatherIconName;
  lastInterventionLabel: string;
  lastInterventionDaysAgo: number;
  interventionsCount: number;
  quotesPending: number;
  /** Total invoiced amount, in euros — used by the "Chiffre d'affaires" sort. */
  revenue: number;
  /** Number of unpaid invoices — used by the "Factures impayées" sort. */
  unpaidInvoices: number;
  footerIcon: FeatherIconName;
  footerText: string;
  footerTint: Tint;
  clientSince: string;
  createdAt: string; // ISO date
};

export const STATUS_META: Record<
  ClientStatus,
  { label: string; color: string; soft: string; accent: string; icon: FeatherIconName }
> = {
  'action-required': {
    label: 'Action requise',
    color: Palette.red,
    soft: Palette.redSoft,
    accent: '#F2707E',
    icon: 'alert-circle',
  },
  'follow-up': {
    label: 'À relancer',
    color: Palette.orange,
    soft: Palette.orangeSoft,
    accent: '#F5BC5A',
    icon: 'clock',
  },
  'up-to-date': {
    label: 'Tout est à jour',
    color: Palette.green,
    soft: Palette.greenSoft,
    accent: '#48C79E',
    icon: 'check-circle',
  },
  new: {
    label: 'Nouveau client',
    color: Palette.blue,
    soft: Palette.blueSoft,
    accent: '#6E9BF2',
    icon: 'user-plus',
  },
};

export const SORT_META: Record<SortKey, { label: string; icon: FeatherIconName }> = {
  priority: { label: 'Priorité', icon: 'zap' },
  name: { label: 'Nom (A → Z)', icon: 'type' },
  recent: { label: 'Dernière intervention', icon: 'calendar' },
  created: { label: "Date d'ajout", icon: 'user-plus' },
  interventions: { label: "Nombre d'interventions", icon: 'bar-chart-2' },
  revenue: { label: "Chiffre d'affaires", icon: 'trending-up' },
  unpaid: { label: 'Factures impayées', icon: 'alert-circle' },
};

/** Order the sorts appear in the filter menu. */
export const SORT_ORDER: SortKey[] = [
  'priority',
  'name',
  'recent',
  'created',
  'interventions',
  'revenue',
  'unpaid',
];

export const STATUS_ORDER: ClientStatus[] = ['action-required', 'follow-up', 'up-to-date', 'new'];

export const TINT_COLORS: Record<Tint, { color: string; soft: string }> = {
  blue: { color: Palette.blue, soft: Palette.blueSoft },
  orange: { color: Palette.orange, soft: Palette.orangeSoft },
  purple: { color: Palette.purple, soft: Palette.purpleSoft },
  green: { color: Palette.green, soft: Palette.greenSoft },
  red: { color: Palette.red, soft: Palette.redSoft },
};
