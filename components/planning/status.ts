import { Feather } from '@expo/vector-icons';

import { Palette } from '@/constants/design';
import { InterventionStatus } from './types';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type StatusMeta = {
  label: string;
  color: string;
  soft: string;
  /** timeline dot rendering */
  dot: 'hollow' | 'icon' | 'pulse';
  dotIcon?: FeatherName;
};

export const STATUS_META: Record<InterventionStatus, StatusMeta> = {
  planned: {
    label: 'Planifiée',
    color: Palette.textSecondary,
    soft: '#F1F3F8',
    dot: 'hollow',
  },
  enRoute: {
    label: 'En route',
    color: Palette.teal,
    soft: Palette.tealSoft,
    dot: 'pulse',
  },
  arrived: {
    label: 'Arrivé',
    color: Palette.purple,
    soft: Palette.purpleSoft,
    dot: 'pulse',
  },
  inProgress: {
    label: 'En cours',
    color: Palette.blue,
    soft: Palette.blueSoft,
    dot: 'pulse',
  },
  done: {
    label: 'Terminée',
    color: Palette.green,
    soft: Palette.greenSoft,
    dot: 'icon',
    dotIcon: 'check',
  },
  postponed: {
    label: 'Reportée',
    color: Palette.orange,
    soft: Palette.orangeSoft,
    dot: 'icon',
    dotIcon: 'arrow-right',
  },
  cancelled: {
    label: 'Annulée',
    color: Palette.textTertiary,
    soft: '#F1F3F8',
    dot: 'icon',
    dotIcon: 'x',
  },
};

// ── Time helpers ──────────────────────────────────────────────────────────────

/** '14:00' → 840 (minutes since midnight) */
export function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** 840 → '14:00' */
export function formatTime(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

