export type MaterielCategory = 'outillage-electroportatif' | 'mesure' | 'securite' | 'levage' | 'autre';
export type MaterielCondition = 'bon-etat' | 'a-reviser' | 'hors-service';

export type MaterielItem = {
  id: string;
  name: string;
  category: MaterielCategory;
  condition: MaterielCondition;
  location: string;
  purchaseDate?: string; // ISO
  serialNumber?: string;
};

export const MATERIEL_CATEGORY_LABEL: Record<MaterielCategory, string> = {
  'outillage-electroportatif': 'Outillage électroportatif',
  mesure: 'Mesure',
  securite: 'Sécurité',
  levage: 'Levage',
  autre: 'Autre',
};

export const MATERIEL_CATEGORY_ORDER: MaterielCategory[] = [
  'outillage-electroportatif',
  'mesure',
  'securite',
  'levage',
  'autre',
];

export const MATERIEL_CONDITION_META: Record<MaterielCondition, { label: string; color: string; soft: string }> = {
  'bon-etat': { label: 'Bon état', color: '#10B981', soft: '#E4F6EE' },
  'a-reviser': { label: 'À réviser', color: '#F59E0B', soft: '#FEF1DC' },
  'hors-service': { label: 'Hors service', color: '#EF4444', soft: '#FDEAEA' },
};

export const MATERIEL_CONDITION_ORDER: MaterielCondition[] = ['bon-etat', 'a-reviser', 'hors-service'];

export const MATERIEL: MaterielItem[] = [
  {
    id: '1',
    name: 'Perceuse Bosch GSB 18V',
    category: 'outillage-electroportatif',
    condition: 'bon-etat',
    location: 'Camionnette — Lucas Bernard',
    purchaseDate: '2023-04-12',
    serialNumber: 'BS-77213',
  },
  {
    id: '2',
    name: 'Détecteur de gaz Testo 316',
    category: 'mesure',
    condition: 'a-reviser',
    location: 'Atelier',
    purchaseDate: '2021-11-03',
    serialNumber: 'TS-58021',
  },
  {
    id: '3',
    name: 'Casque et gants isolants',
    category: 'securite',
    condition: 'bon-etat',
    location: 'Fourgon — Renault Trafic',
  },
];

export function getMaterielById(id: string): MaterielItem | undefined {
  return MATERIEL.find((m) => m.id === id);
}

function nextMaterielId(): string {
  const maxId = MATERIEL.reduce((max, m) => Math.max(max, Number(m.id) || 0), 0);
  return String(maxId + 1);
}

export type MaterielInput = {
  name: string;
  category: MaterielCategory;
  condition: MaterielCondition;
  location: string;
  purchaseDate?: string;
  serialNumber?: string;
};

export function createMateriel(input: MaterielInput): MaterielItem {
  const item: MaterielItem = { id: nextMaterielId(), ...input, name: input.name.trim(), location: input.location.trim() };
  MATERIEL.unshift(item);
  return item;
}

export function updateMateriel(id: string, patch: Partial<MaterielInput>): MaterielItem | undefined {
  const item = getMaterielById(id);
  if (!item) return undefined;
  Object.assign(item, patch);
  return item;
}

export function deleteMateriel(id: string) {
  const index = MATERIEL.findIndex((m) => m.id === id);
  if (index !== -1) MATERIEL.splice(index, 1);
}
