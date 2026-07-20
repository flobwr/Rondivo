import { Feather } from '@expo/vector-icons';

import { getStatusInk, Palette, type PaletteShape } from '@/theme';
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

/**
 * The status vocabulary, resolved on a LIVE palette so Planning chips and
 * timeline dots follow the active theme (a frozen module-scope map would
 * stay on the light paper's colours under Midnight/AMOLED). Pass
 * `useTheme().palette`; call sites without a theme fall back to the active
 * `Palette`.
 *
 * `color` doubles as chip TEXT, so the vivid green/orange (which fail AA on
 * their own wash) come from the text-safe ink; neutral washes reuse the
 * palette's own `inset`, never a hardcoded grey.
 */
export function getStatusMeta(palette: PaletteShape = Palette): Record<InterventionStatus, StatusMeta> {
  const ink = getStatusInk(palette);
  return {
    planned: {
      label: 'Planifiée',
      color: palette.textSecondary,
      soft: palette.inset,
      dot: 'hollow',
    },
    enRoute: {
      label: 'En route',
      color: palette.teal,
      soft: palette.tealSoft,
      dot: 'pulse',
    },
    arrived: {
      label: 'Arrivé',
      color: palette.purple,
      soft: palette.purpleSoft,
      dot: 'pulse',
    },
    inProgress: {
      label: 'En cours',
      color: palette.blue,
      soft: palette.blueSoft,
      dot: 'pulse',
    },
    done: {
      label: 'Terminée',
      color: ink.green,
      soft: palette.greenSoft,
      dot: 'icon',
      dotIcon: 'check',
    },
    postponed: {
      label: 'Reportée',
      color: ink.orange,
      soft: palette.orangeSoft,
      dot: 'icon',
      dotIcon: 'arrow-right',
    },
    cancelled: {
      label: 'Annulée',
      color: palette.textTertiary,
      soft: palette.inset,
      dot: 'icon',
      dotIcon: 'x',
    },
  };
}

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

