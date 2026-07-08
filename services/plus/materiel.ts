import * as MaterielData from '@/data/plus/materiel';

export type { MaterielCategory, MaterielCondition, MaterielInput, MaterielItem } from '@/data/plus/materiel';
export {
  MATERIEL_CATEGORY_LABEL,
  MATERIEL_CATEGORY_ORDER,
  MATERIEL_CONDITION_META,
  MATERIEL_CONDITION_ORDER,
} from '@/data/plus/materiel';

export async function listMateriel(): Promise<MaterielData.MaterielItem[]> {
  return [...MaterielData.MATERIEL];
}

export async function getMateriel(id: string): Promise<MaterielData.MaterielItem | undefined> {
  return MaterielData.getMaterielById(id);
}

export async function createMateriel(input: MaterielData.MaterielInput): Promise<MaterielData.MaterielItem> {
  return MaterielData.createMateriel(input);
}

export async function updateMateriel(
  id: string,
  patch: Partial<MaterielData.MaterielInput>
): Promise<MaterielData.MaterielItem | undefined> {
  return MaterielData.updateMateriel(id, patch);
}

export async function deleteMateriel(id: string): Promise<void> {
  MaterielData.deleteMateriel(id);
}
