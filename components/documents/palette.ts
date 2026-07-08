import { Tone } from './types';

// Muted, slightly desaturated accents — used only within the Documents module.
// Kept local (not in the global Palette) since the app's shared red/orange
// tokens are already tuned for other screens; these read softer for the
// dashboard-style "à traiter" surfaces here. Darkened to clear 4.5:1 against
// their own `soft` background (the original values sat at ~3.1-3.7:1).
export const DocumentsTone: Record<Tone, { color: string; soft: string }> = {
  red: { color: '#9A3B32', soft: '#F7E9E7' },
  orange: { color: '#7A5620', soft: '#F6EFE0' },
};
