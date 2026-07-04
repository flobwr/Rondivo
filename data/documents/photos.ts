import { Palette } from '@/constants/design';

export type PhotoCategory = 'avant' | 'pendant' | 'apres';

export const PHOTO_CATEGORY_LABEL: Record<PhotoCategory, string> = {
  avant: 'Avant',
  pendant: 'Pendant',
  apres: 'Après',
};

export const PHOTO_CATEGORY_ORDER: PhotoCategory[] = ['avant', 'pendant', 'apres'];

// avant = not documented yet (neutral), pendant = job underway (orange),
// après = job documented/closed out (green) — the same red/orange/green
// vocabulary used for status pills everywhere else in the Documents module.
export const PHOTO_CATEGORY_META: Record<PhotoCategory, { color: string; soft: string }> = {
  avant: { color: Palette.textSecondary, soft: Palette.cardMuted },
  pendant: { color: Palette.orange, soft: Palette.orangeSoft },
  apres: { color: Palette.green, soft: Palette.greenSoft },
};

export type InterventionPhoto = {
  id: string;
  uri: string;
  category: PhotoCategory;
};

// Photos are grouped by intervention, not by a flat album — artisans think in
// jobs, not galleries. Each intervention here reuses the exact id/client/date
// already used by its matching rapport (data/documents/rapports.ts), so the
// two screens describe the same real-world job instead of two disconnected
// mock datasets.
export type PhotoIntervention = {
  id: string;
  label: string;
  clientId: string;
  clientName: string;
  date: string; // ISO
  photos: InterventionPhoto[];
};

function seedUri(seed: string) {
  return `https://picsum.photos/seed/${seed}/600/600`;
}

function photosFor(prefix: string, avant: number, pendant: number, apres: number): InterventionPhoto[] {
  const photos: InterventionPhoto[] = [];
  const counts: [PhotoCategory, number][] = [
    ['avant', avant],
    ['pendant', pendant],
    ['apres', apres],
  ];
  let n = 0;
  for (const [category, count] of counts) {
    for (let i = 0; i < count; i++) {
      n += 1;
      photos.push({ id: `${prefix}-${n}`, uri: seedUri(`${prefix}-${n}`), category });
    }
  }
  return photos;
}

export const PHOTO_INTERVENTIONS: PhotoIntervention[] = [
  {
    id: 'int-ra-1',
    label: 'Remplacement chauffe-eau',
    clientId: '6',
    clientName: 'Camille Roux',
    date: '2026-07-01',
    photos: photosFor('ph-1', 3, 5, 4),
  },
  {
    id: 'int-ra-2',
    label: 'Réparation fuite',
    clientId: '7',
    clientName: 'Nicolas Girard',
    date: '2026-06-30',
    photos: photosFor('ph-2', 2, 3, 2),
  },
  {
    id: 'int-ra-3',
    label: 'Entretien chaudière',
    clientId: '8',
    clientName: 'Julie Fontaine',
    date: '2026-06-20',
    photos: photosFor('ph-3', 2, 2, 2),
  },
  {
    id: 'int-ra-4',
    label: 'Installation adoucisseur',
    clientId: '9',
    clientName: 'Thomas Lefevre',
    date: '2026-06-12',
    photos: photosFor('ph-4', 1, 1, 1),
  },
  {
    id: 'int-ra-5',
    label: 'Dépannage évier bouché',
    clientId: '10',
    clientName: 'Emilie Moreau',
    date: '2026-06-05',
    photos: photosFor('ph-5', 1, 1, 1),
  },
];

export function photoCategoryCounts(intervention: PhotoIntervention): Record<PhotoCategory, number> {
  const counts: Record<PhotoCategory, number> = { avant: 0, pendant: 0, apres: 0 };
  for (const photo of intervention.photos) counts[photo.category] += 1;
  return counts;
}
