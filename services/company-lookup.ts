/**
 * Async facade over `data/company-lookup.ts`'s mock VAT directory. Not
 * consumed directly by any screen today — `components/clients/new/company-
 * lookup-provider.ts` is the real seam a future VIES/SIRENE lookup plugs
 * into and already reads `MOCK_VAT_DIRECTORY` from `@/data/company-lookup`.
 * This file exists purely so the raw dataset is reachable the same way as
 * every other entity, should a future call site need it directly.
 */
import * as CompanyLookupData from '@/data/company-lookup';
import { type CompanyLookup } from '@/components/clients/new/company-lookup-provider';

export type { CompanyLookup } from '@/components/clients/new/company-lookup-provider';

export async function getCompanyByVat(vatNumber: string): Promise<CompanyLookup | undefined> {
  return CompanyLookupData.MOCK_VAT_DIRECTORY[vatNumber];
}
