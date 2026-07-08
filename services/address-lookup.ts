/**
 * Async facade over `data/address-lookup.ts`'s mock dataset. Not consumed
 * directly by any screen today — `components/clients/new/address-provider.ts`
 * is the real seam a future geocoder plugs into and already reads
 * `MOCK_ADDRESSES` from `@/data/address-lookup`. This file exists purely so
 * the raw dataset is reachable the same way as every other entity, should a
 * future call site need it directly.
 */
import * as AddressLookupData from '@/data/address-lookup';
import { type AddressSuggestion } from '@/components/clients/new/address-provider';

export type { AddressSuggestion } from '@/components/clients/new/address-provider';

export async function listMockAddresses(): Promise<AddressSuggestion[]> {
  return [...AddressLookupData.MOCK_ADDRESSES];
}
