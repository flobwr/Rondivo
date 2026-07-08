import { MOCK_VAT_DIRECTORY } from '@/data/company-lookup';

export type CompanyLookup = { name: string; address: string };

/**
 * The seam a real SIRENE/VIES lookup plugs into later — not wired up now, per
 * the brief ("prévoir l'architecture, ne pas implémenter la récupération").
 * `lookup` may return synchronously or a Promise, found-or-not.
 */
export type CompanyLookupProvider = {
  lookup: (vatNumber: string) => CompanyLookup | null | Promise<CompanyLookup | null>;
};

export function normalizeVat(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

/** French VAT shape: "FR" + 2-digit key + 9-digit SIREN. */
export function isValidFrenchVat(value: string): boolean {
  return /^FR\d{11}$/.test(normalizeVat(value));
}

export const mockCompanyLookupProvider: CompanyLookupProvider = {
  lookup(vatNumber: string) {
    const key = normalizeVat(vatNumber);
    if (!isValidFrenchVat(key)) return null;
    return MOCK_VAT_DIRECTORY[key] ?? null;
  },
};
