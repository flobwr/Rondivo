import { Tone } from './types';

// Muted, slightly desaturated accents — used only within the Documents module.
// Kept local (not in the global Palette) since the app's shared red/orange
// tokens are already tuned for other screens; these read softer for the
// dashboard-style "à traiter" surfaces here.
export const DocumentsTone: Record<Tone, { color: string; soft: string }> = {
  red: { color: '#C1584F', soft: '#F7E9E7' },
  orange: { color: '#AD7F3B', soft: '#F6EFE0' },
};
