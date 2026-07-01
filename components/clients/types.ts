import { Feather } from '@expo/vector-icons';

import { Palette } from '@/constants/design';

export type ClientStatus = 'action-required' | 'follow-up' | 'up-to-date' | 'new';

export type SortKey = 'priority' | 'name' | 'recent';
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
  lastInterventionLabel: string;
  lastInterventionDaysAgo: number;
  interventionsCount: number;
  quotesPending: number;
  footerIcon: FeatherIconName;
  footerText: string;
  footerTint: Tint;
  clientSince: string;
  createdAt: string; // ISO date
};

export const STATUS_META: Record<
  ClientStatus,
  { label: string; color: string; soft: string; icon: FeatherIconName }
> = {
  'action-required': { label: 'Action requise', color: Palette.red, soft: Palette.redSoft, icon: 'alert-circle' },
  'follow-up': { label: 'À relancer', color: Palette.orange, soft: Palette.orangeSoft, icon: 'clock' },
  'up-to-date': { label: 'Tout est à jour', color: Palette.green, soft: Palette.greenSoft, icon: 'check-circle' },
  new: { label: 'Nouveau client', color: Palette.blue, soft: Palette.blueSoft, icon: 'user-plus' },
};

export const SORT_META: Record<SortKey, { label: string }> = {
  priority: { label: 'Priorité' },
  name: { label: 'Nom' },
  recent: { label: 'Dernière intervention' },
};

export const TINT_COLORS: Record<Tint, { color: string; soft: string }> = {
  blue: { color: Palette.blue, soft: Palette.blueSoft },
  orange: { color: Palette.orange, soft: Palette.orangeSoft },
  purple: { color: Palette.purple, soft: Palette.purpleSoft },
  green: { color: Palette.green, soft: Palette.greenSoft },
  red: { color: Palette.red, soft: Palette.redSoft },
};
