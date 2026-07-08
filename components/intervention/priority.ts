import { Palette } from '@/constants/design';
import { Priority } from './types';

// Palette.orange itself stays untouched (it's used as a solid accent
// elsewhere) — this is a dedicated darker ink for orange-text-on-orangeSoft,
// which at the shared token's value sat at ~1.9:1 against orangeSoft.
const HAUTE_INK = '#7A5620';

export const PRIORITY_CONFIG: Record<Priority, { label: string; shortLabel: string; color: string; background: string }> = {
  basse: { label: 'Priorité basse', shortLabel: 'Basse', color: Palette.textSecondary, background: Palette.cardMuted },
  normale: { label: 'Priorité normale', shortLabel: 'Normale', color: Palette.blue, background: Palette.blueSoft },
  haute: { label: 'Priorité haute', shortLabel: 'Haute', color: HAUTE_INK, background: Palette.orangeSoft },
};
