import type { CompanyLookup } from '@/components/clients/new/company-lookup-provider';

/**
 * Local stand-in for a VIES/SIRENE call (recherche-entreprises.api.gouv.fr is
 * free and keyless, and would be the natural real source since a French VAT
 * number's last 9 digits are the company's SIREN — but this sandbox's network
 * policy blocks that host too, confirmed via the same 403-on-CONNECT check as
 * the address provider). A tiny local directory keyed by VAT number, same
 * shape a real lookup would return.
 */
export const MOCK_VAT_DIRECTORY: Record<string, CompanyLookup> = {
  FR32123456789: { name: 'Plomberie Générale SARL', address: '12 rue Victor Hugo, 69002 Lyon' },
  FR15987654321: { name: 'Élec Pro Rhône', address: '3 place Bellecour, 69002 Lyon' },
  FR76456789123: { name: 'Bâti Confort SAS', address: '45 cours Émile Zola, 69100 Villeurbanne' },
};
