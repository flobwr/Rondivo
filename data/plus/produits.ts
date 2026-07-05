export type Produit = {
  id: string;
  name: string;
  reference: string;
  unitPrice: number;
  stock: number;
};

export const PRODUITS: Produit[] = [
  { id: '1', name: 'Chaudière Frisquet Hydromotrix', reference: 'FRQ-HM-24', unitPrice: 2450, stock: 2 },
  { id: '2', name: 'Radiateur acier 1200W', reference: 'RAD-AC-1200', unitPrice: 165, stock: 6 },
  { id: '3', name: 'Vanne thermostatique', reference: 'VT-STD', unitPrice: 28, stock: 14 },
];

export function getProduitById(id: string): Produit | undefined {
  return PRODUITS.find((p) => p.id === id);
}

function nextProduitId(): string {
  const maxId = PRODUITS.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
  return String(maxId + 1);
}

export type ProduitInput = { name: string; reference: string; unitPrice: number; stock: number };

export function createProduit(input: ProduitInput): Produit {
  const produit: Produit = { id: nextProduitId(), ...input, name: input.name.trim(), reference: input.reference.trim() };
  PRODUITS.unshift(produit);
  return produit;
}

export function updateProduit(id: string, patch: Partial<ProduitInput>): Produit | undefined {
  const produit = getProduitById(id);
  if (!produit) return undefined;
  Object.assign(produit, patch);
  return produit;
}

export function deleteProduit(id: string) {
  const index = PRODUITS.findIndex((p) => p.id === id);
  if (index !== -1) PRODUITS.splice(index, 1);
}
