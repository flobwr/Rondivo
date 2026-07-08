import * as SuppliersData from '@/data/plus/suppliers';

export type { Supplier, SupplierCategory, SupplierInput } from '@/data/plus/suppliers';
export { SUPPLIER_CATEGORY_LABEL, SUPPLIER_CATEGORY_ORDER } from '@/data/plus/suppliers';

export async function listSuppliers(): Promise<SuppliersData.Supplier[]> {
  return [...SuppliersData.SUPPLIERS];
}

export async function getSupplier(id: string): Promise<SuppliersData.Supplier | undefined> {
  return SuppliersData.getSupplierById(id);
}

export async function createSupplier(input: SuppliersData.SupplierInput): Promise<SuppliersData.Supplier> {
  return SuppliersData.createSupplier(input);
}

export async function updateSupplier(
  id: string,
  patch: Partial<SuppliersData.SupplierInput>
): Promise<SuppliersData.Supplier | undefined> {
  return SuppliersData.updateSupplier(id, patch);
}

export async function deleteSupplier(id: string): Promise<void> {
  SuppliersData.deleteSupplier(id);
}
