import * as ProduitsData from '@/data/plus/produits';

export type { Produit, ProduitInput } from '@/data/plus/produits';

export async function listProduits(): Promise<ProduitsData.Produit[]> {
  return [...ProduitsData.PRODUITS];
}

export async function getProduit(id: string): Promise<ProduitsData.Produit | undefined> {
  return ProduitsData.getProduitById(id);
}

export async function createProduit(input: ProduitsData.ProduitInput): Promise<ProduitsData.Produit> {
  return ProduitsData.createProduit(input);
}

export async function updateProduit(
  id: string,
  patch: Partial<ProduitsData.ProduitInput>
): Promise<ProduitsData.Produit | undefined> {
  return ProduitsData.updateProduit(id, patch);
}

export async function deleteProduit(id: string): Promise<void> {
  ProduitsData.deleteProduit(id);
}
