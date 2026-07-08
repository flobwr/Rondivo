import { MOCK_ADDRESSES } from '@/data/address-lookup';

export type AddressSuggestion = {
  id: string;
  line: string;
  city: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
};

/**
 * The seam a real geocoder plugs into. `AddressField` only ever talks to this
 * shape — it doesn't know or care whether `search` hits Google Places,
 * Mapbox, HERE, the French national address API, or (today) a local list.
 * Swapping providers later is: implement this interface, pass it as a prop.
 * `search` may return synchronously or a Promise — `AddressField` handles both.
 */
export type AddressProvider = {
  search: (query: string) => AddressSuggestion[] | Promise<AddressSuggestion[]>;
};

/** "12 rue Victor Hugo, 69002 Lyon" — matches the format used everywhere else in the app. */
export function formatAddress(a: AddressSuggestion): string {
  return `${a.line}, ${a.postalCode} ${a.city}`;
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export const mockAddressProvider: AddressProvider = {
  search(query: string) {
    const q = normalize(query);
    if (q.length < 2) return [];
    return MOCK_ADDRESSES.filter((a) => normalize(`${a.line} ${a.city} ${a.postalCode}`).includes(q)).slice(0, 5);
  },
};
