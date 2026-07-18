/** '24 Av. Félix Faure, 69003 Lyon' → '24 Av. Félix Faure, Lyon' — drops the
 *  postcode noise, keeps street + city (what you actually read before driving). */
export function compactAddress(address: string): string {
  return address.replace(/,\s*\d{4,5}\s+/g, ', ');
}
