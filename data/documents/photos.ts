export type PhotoCategory = 'avant' | 'pendant' | 'apres';

export const PHOTO_CATEGORY_LABEL: Record<PhotoCategory, string> = {
  avant: 'Avant',
  pendant: 'Pendant',
  apres: 'Après',
};

export type DocPhoto = {
  id: string;
  uri: string;
  clientId: string;
  clientName: string;
  interventionId: string;
  interventionLabel: string;
  category: PhotoCategory;
  date: string; // ISO
};

// Seeded placeholder images — stand in for real intervention photos until the
// camera/upload pipeline is wired up.
function seedUri(seed: string) {
  return `https://picsum.photos/seed/${seed}/600/600`;
}

export const MOCK_PHOTOS: DocPhoto[] = [
  { id: 'ph-1', uri: seedUri('rondivo-1'), clientId: '6', clientName: 'Camille Roux', interventionId: 'int-ra-1', interventionLabel: 'Remplacement chauffe-eau', category: 'avant', date: '2026-07-01' },
  { id: 'ph-2', uri: seedUri('rondivo-2'), clientId: '6', clientName: 'Camille Roux', interventionId: 'int-ra-1', interventionLabel: 'Remplacement chauffe-eau', category: 'pendant', date: '2026-07-01' },
  { id: 'ph-3', uri: seedUri('rondivo-3'), clientId: '6', clientName: 'Camille Roux', interventionId: 'int-ra-1', interventionLabel: 'Remplacement chauffe-eau', category: 'apres', date: '2026-07-01' },
  { id: 'ph-4', uri: seedUri('rondivo-4'), clientId: '7', clientName: 'Nicolas Girard', interventionId: 'int-ra-2', interventionLabel: 'Réparation fuite', category: 'avant', date: '2026-06-30' },
  { id: 'ph-5', uri: seedUri('rondivo-5'), clientId: '7', clientName: 'Nicolas Girard', interventionId: 'int-ra-2', interventionLabel: 'Réparation fuite', category: 'apres', date: '2026-06-30' },
  { id: 'ph-6', uri: seedUri('rondivo-6'), clientId: '8', clientName: 'Julie Fontaine', interventionId: 'int-ra-3', interventionLabel: 'Entretien chaudière', category: 'avant', date: '2026-06-20' },
  { id: 'ph-7', uri: seedUri('rondivo-7'), clientId: '8', clientName: 'Julie Fontaine', interventionId: 'int-ra-3', interventionLabel: 'Entretien chaudière', category: 'pendant', date: '2026-06-20' },
  { id: 'ph-8', uri: seedUri('rondivo-8'), clientId: '8', clientName: 'Julie Fontaine', interventionId: 'int-ra-3', interventionLabel: 'Entretien chaudière', category: 'apres', date: '2026-06-20' },
  { id: 'ph-9', uri: seedUri('rondivo-9'), clientId: '9', clientName: 'Thomas Lefevre', interventionId: 'int-ra-4', interventionLabel: 'Installation adoucisseur', category: 'avant', date: '2026-06-12' },
  { id: 'ph-10', uri: seedUri('rondivo-10'), clientId: '9', clientName: 'Thomas Lefevre', interventionId: 'int-ra-4', interventionLabel: 'Installation adoucisseur', category: 'pendant', date: '2026-06-12' },
  { id: 'ph-11', uri: seedUri('rondivo-11'), clientId: '9', clientName: 'Thomas Lefevre', interventionId: 'int-ra-4', interventionLabel: 'Installation adoucisseur', category: 'apres', date: '2026-06-12' },
  { id: 'ph-12', uri: seedUri('rondivo-12'), clientId: '10', clientName: 'Emilie Moreau', interventionId: 'int-ra-5', interventionLabel: 'Dépannage évier bouché', category: 'apres', date: '2026-06-05' },
];

export function uniqueClientsInPhotos(): { id: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const p of MOCK_PHOTOS) seen.set(p.clientId, p.clientName);
  return Array.from(seen, ([id, name]) => ({ id, name }));
}
