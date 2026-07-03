// Real E.164 parsing/formatting/validation via libphonenumber-js — per-country
// national formatting (a French "06 12 34 56 78" and a Belgian "0470 12 34 56"
// each follow their own country's real grouping, not a hand-rolled guess) and
// real validation, instead of reimplementing phone-number rules by hand.
//
// Imported from the package's top-level entry, not the lighter `/mobile`
// subpath: that subpath is only reachable through the package's "exports"
// map (no legacy "main" fallback exists for it), and Metro failed to resolve
// it at runtime ("Unable to resolve module libphonenumber-js/mobile") even
// though it resolves fine under plain Node and Expo's web bundler — the two
// take different resolution paths, and only the native one broke. The
// top-level import has a real "main" field, so it resolves the same way on
// every bundler/Metro version regardless of "exports" support, at the cost
// of a slightly larger metadata bundle (~154KB vs. ~97KB).
import { AsYouType, getCountries, getCountryCallingCode, getExampleNumber, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
// A physical file at the package root (not nested behind a subpath-only
// "exports" entry), so it resolves the same way "." does — see the note
// above about why "/mobile" specifically broke under Metro.
import PHONE_NUMBER_EXAMPLES from 'libphonenumber-js/examples.mobile.json';

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

/** "0470 12 34 56" → "0470123456". The only thing ever stored as "raw" state. */
export function digitsOnly(text: string): string {
  return text.replace(/\D/g, '');
}

// E.164's hard cap is 15 digits total; a few of those are the country code,
// so 14 is a safe ceiling for the national significant number alone.
const MAX_NATIONAL_DIGITS = 14;

/**
 * Live "as you type" national formatting for the given country, e.g. FR
 * "0612345678" → "06 12 34 56 78". Always re-derived from digits only — never
 * feed this a string that already contains the separators it previously
 * inserted (spaces/parens/dashes): AsYouType is a fresh, stateless call each
 * time here, so re-feeding its own output back in double-applies formatting
 * logic and is exactly what silently broke live reformatting before.
 */
export function formatNational(rawText: string, country: CountryCode): string {
  return new AsYouType(country).input(digitsOnly(rawText).slice(0, MAX_NATIONAL_DIGITS));
}

/** E.164 for storage ("+33612345678") once the number is valid for that country, else null. */
export function toE164(rawText: string, country: CountryCode): string | null {
  const formatter = new AsYouType(country);
  formatter.input(digitsOnly(rawText).slice(0, MAX_NATIONAL_DIGITS));
  const number = formatter.getNumber();
  return number?.isValid() ? number.number : null;
}

export function isValidPhoneFor(rawText: string, country: CountryCode): boolean {
  const formatter = new AsYouType(country);
  formatter.input(digitsOnly(rawText).slice(0, MAX_NATIONAL_DIGITS));
  return formatter.getNumber()?.isValid() ?? false;
}

/** A real example number for the country, formatted nationally — "0470 12 34 56" for BE, "(415) 555-0123" for US, etc. */
export function getPhonePlaceholder(country: CountryCode): string {
  const example = getExampleNumber(country, PHONE_NUMBER_EXAMPLES);
  return example ? example.formatNational() : '';
}

/** The index in `text` right after its Nth digit — used to place the cursor after reformatting. */
export function indexAfterDigitCount(text: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i])) {
      seen++;
      if (seen === count) return i + 1;
    }
  }
  return text.length;
}

/**
 * Finds where `oldText` and `newText` diverge — the common prefix and common
 * suffix around whatever was typed/deleted — by comparing the two strings
 * directly. Deliberately independent of `onSelectionChange`: that event's
 * timing relative to `onChangeText` isn't guaranteed across platforms (it
 * arrived too late — or not at all before the next keystroke — under
 * react-native-web in testing, which left the tracked cursor stuck at 0 and
 * inserted every new digit at the *front* instead of the end). Diffing two
 * plain strings has no such race: `oldText` is exactly what this render
 * displayed, and `newText` is exactly what the field reports.
 */
export function diffEditRegion(oldText: string, newText: string): { position: number; insertedCount: number } {
  const minLen = Math.min(oldText.length, newText.length);
  let prefixLen = 0;
  while (prefixLen < minLen && oldText[prefixLen] === newText[prefixLen]) prefixLen++;
  let suffixLen = 0;
  while (
    suffixLen < minLen - prefixLen &&
    oldText[oldText.length - 1 - suffixLen] === newText[newText.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }
  return { position: prefixLen, insertedCount: Math.max(0, newText.length - prefixLen - suffixLen) };
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
