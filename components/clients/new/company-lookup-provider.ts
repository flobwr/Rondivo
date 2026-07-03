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

/**
 * Local stand-in for a VIES/SIRENE call (recherche-entreprises.api.gouv.fr is
 * free and keyless, and would be the natural real source since a French VAT
 * number's last 9 digits are the company's SIREN — but this sandbox's network
 * policy blocks that host too, confirmed via the same 403-on-CONNECT check as
 * the address provider). A tiny local directory keyed by VAT number, same
 * shape a real lookup would return.
 */
const MOCK_VAT_DIRECTORY: Record<string, CompanyLookup> = {
  FR32123456789: { name: 'Plomberie Générale SARL', address: '12 rue Victor Hugo, 69002 Lyon' },
  FR15987654321: { name: 'Élec Pro Rhône', address: '3 place Bellecour, 69002 Lyon' },
  FR76456789123: { name: 'Bâti Confort SAS', address: '45 cours Émile Zola, 69100 Villeurbanne' },
};

export const mockCompanyLookupProvider: CompanyLookupProvider = {
  lookup(vatNumber: string) {
    const key = normalizeVat(vatNumber);
    if (!isValidFrenchVat(key)) return null;
    return MOCK_VAT_DIRECTORY[key] ?? null;
  },
};
