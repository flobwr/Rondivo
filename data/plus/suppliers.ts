export type SupplierCategory = 'plomberie' | 'electricite' | 'chauffage' | 'materiaux' | 'outillage' | 'autre';

export type Supplier = {
  id: string;
  name: string;
  category: SupplierCategory;
  phone: string;
  email: string;
  address: string;
};

export const SUPPLIER_CATEGORY_LABEL: Record<SupplierCategory, string> = {
  plomberie: 'Plomberie',
  electricite: 'Électricité',
  chauffage: 'Chauffage',
  materiaux: 'Matériaux',
  outillage: 'Outillage',
  autre: 'Autre',
};

export const SUPPLIER_CATEGORY_ORDER: SupplierCategory[] = [
  'plomberie',
  'electricite',
  'chauffage',
  'materiaux',
  'outillage',
  'autre',
];

export const SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'CEDEO Lyon',
    category: 'plomberie',
    phone: '04 78 00 11 22',
    email: 'lyon@cedeo.fr',
    address: '22 rue de l’Industrie, 69003 Lyon',
  },
  {
    id: '2',
    name: 'Rexel Matériel Électrique',
    category: 'electricite',
    phone: '04 78 22 33 44',
    email: 'contact@rexel.fr',
    address: '8 av. Lacassagne, 69003 Lyon',
  },
  {
    id: '3',
    name: 'Point P',
    category: 'materiaux',
    phone: '04 78 44 55 66',
    email: 'lyon.pointp@pointp.fr',
    address: '55 route de Vienne, 69008 Lyon',
  },
];

export function getSupplierById(id: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.id === id);
}

function nextSupplierId(): string {
  const maxId = SUPPLIERS.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0);
  return String(maxId + 1);
}

export type SupplierInput = {
  name: string;
  category: SupplierCategory;
  phone: string;
  email: string;
  address: string;
};

export function createSupplier(input: SupplierInput): Supplier {
  const supplier: Supplier = { id: nextSupplierId(), ...input, name: input.name.trim() };
  SUPPLIERS.unshift(supplier);
  return supplier;
}

export function updateSupplier(id: string, patch: Partial<SupplierInput>): Supplier | undefined {
  const supplier = getSupplierById(id);
  if (!supplier) return undefined;
  Object.assign(supplier, patch);
  return supplier;
}

export function deleteSupplier(id: string) {
  const index = SUPPLIERS.findIndex((s) => s.id === id);
  if (index !== -1) SUPPLIERS.splice(index, 1);
}
