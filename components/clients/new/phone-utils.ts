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
import { getLocales } from 'expo-localization';
import { type Mask, type MaskArray } from 'react-native-mask-input';

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

const FALLBACK_PHONE_COUNTRY: CountryCode = 'FR';

/**
 * Most artisans work in one country almost exclusively, so the dial code
 * shouldn't be a decision the artisan makes on every client — it defaults to
 * the device's own region (Settings → Language & Region on iOS, Region on
 * Android; there's no user-account concept in this app to key off instead)
 * and stays a one-tap change via the picker for the artisan who occasionally
 * needs it. Computed once per app run: the device region doesn't change
 * mid-session, and this reaches into native locale data, so it isn't free.
 */
export const DEFAULT_PHONE_COUNTRY: CountryCode = (() => {
  const region = getLocales()[0]?.regionCode as CountryCode | null;
  // Must be one of *our* listed countries, not just anything libphonenumber
  // supports — otherwise the picker button would show a flag/code for a
  // country that isn't actually in its own list.
  return region && region in COUNTRY_NAMES_FR ? region : FALLBACK_PHONE_COUNTRY;
})();

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

function maskArrayFromTemplate(template: string, minDigitSlots = 0): MaskArray {
  const mask: MaskArray = [...template].map((char) => (/\d/.test(char) ? /\d/ : char));
  const digitSlots = mask.filter((item) => item instanceof RegExp).length;
  // Lets typing continue past whatever grouping was templated — extra bare
  // digit slots, no forced separator. Harmless even when unused: a dynamic
  // mask (below) recomputes the real grouping on the very next keystroke.
  for (let i = digitSlots; i < Math.max(minDigitSlots, MAX_NATIONAL_DIGITS); i++) mask.push(/\d/);
  return mask;
}

/**
 * A per-country mask for react-native-mask-input's `value` prop — this is
 * the only thing driving the live text field now. libphonenumber-js stays
 * out of the keystroke *state* path entirely (no more hand-tracked cursor
 * math); it's used only to compute what the mask *should look like*, and
 * again at submit time to validate/convert to E.164 (see toE164 below).
 * Applying the mask, positioning the cursor, mid-string deletion and paste
 * are all handled by the mask library — chosen specifically because it
 * doesn't compute/reassign cursor position at all for a plain mask (see
 * PhoneField.tsx for why that's the right call).
 *
 * This returns a *function* mask, not a fixed array: some countries group
 * digits differently depending on the specific prefix (a German "0170…"
 * mobile number and a "01512…" one aren't grouped the same way), so the
 * mask is rebuilt from AsYouType on every call, fed exactly the digits
 * typed so far — the same real grouping AsYouType would produce, just
 * applied by a component built to do that without breaking the cursor.
 */
export function buildPhoneMask(country: CountryCode): Mask {
  return (value?: string) => {
    const digits = digitsOnly(value ?? '').slice(0, MAX_NATIONAL_DIGITS);
    const template = digits ? new AsYouType(country).input(digits) : getPhonePlaceholder(country);
    return maskArrayFromTemplate(template, digits.length);
  };
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
