import { Feather } from '@expo/vector-icons';

import { Palette } from '@/constants/design';
import { InterventionPriority, InterventionStatus } from './types';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type StatusMeta = {
  label: string;
  color: string;
  soft: string;
  /** timeline dot rendering */
  dot: 'hollow' | 'icon' | 'pulse';
  dotIcon?: FeatherName;
  /** the in-progress chip is filled so the active job owns the screen */
  chipFilled: boolean;
};

export const STATUS_META: Record<InterventionStatus, StatusMeta> = {
  planned: {
    label: 'Planifiée',
    color: Palette.textSecondary,
    soft: '#F1F3F8',
    dot: 'hollow',
    chipFilled: false,
  },
  enRoute: {
    label: 'En route',
    color: Palette.teal,
    soft: Palette.tealSoft,
    dot: 'icon',
    dotIcon: 'truck',
    chipFilled: false,
  },
  arrived: {
    label: 'Arrivé',
    color: Palette.purple,
    soft: Palette.purpleSoft,
    dot: 'icon',
    dotIcon: 'map-pin',
    chipFilled: false,
  },
  inProgress: {
    label: 'En cours',
    color: Palette.blue,
    soft: Palette.blueSoft,
    dot: 'pulse',
    chipFilled: true,
  },
  done: {
    label: 'Terminée',
    color: Palette.green,
    soft: Palette.greenSoft,
    dot: 'icon',
    dotIcon: 'check',
    chipFilled: false,
  },
  postponed: {
    label: 'Reportée',
    color: Palette.orange,
    soft: Palette.orangeSoft,
    dot: 'icon',
    dotIcon: 'arrow-right',
    chipFilled: false,
  },
};

export type PriorityMeta = {
  label: string;
  color: string;
  soft: string;
  icon: FeatherName;
};

export const PRIORITY_META: Partial<Record<InterventionPriority, PriorityMeta>> = {
  high: { label: 'Prioritaire', color: Palette.orange, soft: Palette.orangeSoft, icon: 'flag' },
  urgent: { label: 'Urgent', color: Palette.red, soft: Palette.redSoft, icon: 'zap' },
};

/** 90 → '1h30', 45 → '45 min' */
export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h00` : `${h}h${String(m).padStart(2, '0')}`;
}
