// Real E.164 parsing/formatting/validation via libphonenumber-js — per-country
// national formatting (a French "06 12 34 56 78" and a Belgian "0470 12 34 56"
// each follow their own country's real grouping, not a hand-rolled guess) and
// real validation, instead of reimplementing phone-number rules by hand.
// `/mobile` is the variant tuned for mobile apps: smaller metadata bundle,
// mobile-number patterns — the right fit for a client-contact field.
import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/mobile';

export type { CountryCode };

export type CountryOption = {
  iso2: CountryCode;
  name: string;
  flag: string;
  callingCode: string;
};

// Flag emoji is just two Regional Indicator Symbols spelling out the ISO code
// — no need to hand-maintain 200+ emoji.
function flagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// A curated, realistic set for Rondivo's market (France/Belgium-based artisans
// and their clients) rather than all ~245 ISO countries — easy to extend later
// by adding a name to this map; flag and dial code are derived automatically.
const COUNTRY_NAMES_FR: Partial<Record<CountryCode, string>> = {
  FR: 'France',
  BE: 'Belgique',
  LU: 'Luxembourg',
  DE: 'Allemagne',
  CH: 'Suisse',
  IT: 'Italie',
  ES: 'Espagne',
  PT: 'Portugal',
  NL: 'Pays-Bas',
  GB: 'Royaume-Uni',
  IE: 'Irlande',
  AT: 'Autriche',
  MC: 'Monaco',
  MA: 'Maroc',
  DZ: 'Algérie',
  TN: 'Tunisie',
  US: 'États-Unis',
  CA: 'Canada',
};

const SUPPORTED_COUNTRIES = new Set(getCountries());

export const COUNTRY_OPTIONS: CountryOption[] = (Object.entries(COUNTRY_NAMES_FR) as [CountryCode, string][])
  .filter(([iso2]) => SUPPORTED_COUNTRIES.has(iso2))
  .map(([iso2, name]) => ({ iso2, name, flag: flagEmoji(iso2), callingCode: getCountryCallingCode(iso2) }))
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'FR';

export function getCountryOption(iso2: CountryCode): CountryOption | undefined {
  return COUNTRY_OPTIONS.find((c) => c.iso2 === iso2);
}

/** Live "as you type" national formatting for the given country, e.g. FR "0612345678" → "06 12 34 56 78". */
export function formatNational(rawText: string, country: CountryCode): string {
  return new AsYouType(country).input(rawText);
}

/** E.164 for storage ("+33612345678") once the number is valid for that country, else null. */
export function toE164(rawText: string, country: CountryCode): string | null {
  const formatter = new AsYouType(country);
  formatter.input(rawText);
  const number = formatter.getNumber();
  return number?.isValid() ? number.number : null;
}

export function isValidPhoneFor(rawText: string, country: CountryCode): boolean {
  const formatter = new AsYouType(country);
  formatter.input(rawText);
  return formatter.getNumber()?.isValid() ?? false;
}

/**
 * Numbers are stored as E.164 ("+33612345678") but always displayed in their
 * readable national form ("06 12 34 56 78"). Anything not E.164-shaped (the
 * seed dataset's hand-written mock numbers) passes through untouched, so
 * existing clients never change on screen.
 */
export function formatPhoneDisplay(phone: string): string {
  if (!phone || !phone.startsWith('+')) return phone;
  const parsed = parsePhoneNumberFromString(phone);
  return parsed ? parsed.formatNational() : phone;
}
