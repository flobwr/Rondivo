import { Palette } from '@/constants/design';
import { Priority } from './types';

export const PRIORITY_CONFIG: Record<Priority, { label: string; shortLabel: string; color: string; background: string }> = {
  basse: { label: 'Priorité basse', shortLabel: 'Basse', color: Palette.textSecondary, background: Palette.cardMuted },
  normale: { label: 'Priorité normale', shortLabel: 'Normale', color: Palette.blue, background: Palette.blueSoft },
  haute: { label: 'Priorité haute', shortLabel: 'Haute', color: Palette.orange, background: Palette.orangeSoft },
};
