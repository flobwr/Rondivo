import { LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Same 180ms opacity-based easing as the appointment form — every accordion,
// suggestion list and inline row across the app's forms should feel identical.
export const easeLayout = () =>
  LayoutAnimation.configureNext({
    duration: 180,
    update: { type: LayoutAnimation.Types.easeInEaseOut },
    create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
  });

export type AddressSuggestion = {
  id: string;
  line: string;
  city: string;
  postalCode: string;
  country: string;
  /** Structured exactly like a real geocoder's result, GPS included. */
  lat: number;
  lng: number;
};

/**
 * Stand-in for the French national address API (api-adresse.data.gouv.fr,
 * free and keyless — the natural pick over Google Places for a France-only
 * dataset) or Google Places. This sandbox's outbound network policy blocks
 * both hosts at the gateway (confirmed: 403 on CONNECT), so a live call
 * isn't reachable from here. This mimics the real interaction (type-ahead,
 * structured result incl. GPS, tap to fill) against a local dataset with the
 * exact same shape a real response would have — swapping in a live provider
 * later only means replacing this function's body.
 */
const MOCK_ADDRESSES: AddressSuggestion[] = [
  { id: 'a1', line: '12 rue Victor Hugo', city: 'Lyon', postalCode: '69002', country: 'France', lat: 45.7597, lng: 4.8422 },
  { id: 'a2', line: '3 place Bellecour', city: 'Lyon', postalCode: '69002', country: 'France', lat: 45.7578, lng: 4.832 },
  { id: 'a3', line: '24 rue de Mons', city: 'Lyon', postalCode: '69003', country: 'France', lat: 45.7484, lng: 4.8531 },
  { id: 'a4', line: '5 cours Lafayette', city: 'Lyon', postalCode: '69003', country: 'France', lat: 45.7614, lng: 4.8489 },
  { id: 'a5', line: '2 place des Terreaux', city: 'Lyon', postalCode: '69001', country: 'France', lat: 45.7679, lng: 4.8342 },
  { id: 'a6', line: '17 quai Saint-Antoine', city: 'Lyon', postalCode: '69002', country: 'France', lat: 45.7614, lng: 4.8321 },
  { id: 'a7', line: '9 rue Childebert', city: 'Lyon', postalCode: '69002', country: 'France', lat: 45.7594, lng: 4.833 },
  { id: 'a8', line: '77 rue Duguesclin', city: 'Lyon', postalCode: '69006', country: 'France', lat: 45.7683, lng: 4.8477 },
  { id: 'a9', line: '29 rue Garibaldi', city: 'Lyon', postalCode: '69006', country: 'France', lat: 45.7669, lng: 4.851 },
  { id: 'a10', line: '14 montée de la Grande Côte', city: 'Lyon', postalCode: '69001', country: 'France', lat: 45.772, lng: 4.8318 },
  { id: 'a11', line: '61 rue de Marseille', city: 'Lyon', postalCode: '69007', country: 'France', lat: 45.7431, lng: 4.8388 },
  { id: 'a12', line: '8 rue de la République', city: 'Lyon', postalCode: '69001', country: 'France', lat: 45.7671, lng: 4.8357 },
  { id: 'a13', line: '45 cours Émile Zola', city: 'Villeurbanne', postalCode: '69100', country: 'France', lat: 45.7686, lng: 4.8797 },
  { id: 'a14', line: '18 rue du 4 Août', city: 'Villeurbanne', postalCode: '69100', country: 'France', lat: 45.7664, lng: 4.8797 },
  { id: 'a15', line: '10 rue de Rivoli', city: 'Paris', postalCode: '75004', country: 'France', lat: 48.8558, lng: 2.3617 },
  { id: 'a16', line: '22 avenue des Champs-Élysées', city: 'Paris', postalCode: '75008', country: 'France', lat: 48.8698, lng: 2.3079 },
  { id: 'a17', line: '5 boulevard Saint-Germain', city: 'Paris', postalCode: '75005', country: 'France', lat: 48.8496, lng: 2.3535 },
  { id: 'a18', line: '30 la Canebière', city: 'Marseille', postalCode: '13001', country: 'France', lat: 43.2977, lng: 5.3781 },
  { id: 'a19', line: '7 rue Paradis', city: 'Marseille', postalCode: '13001', country: 'France', lat: 43.2939, lng: 5.3776 },
  { id: 'a20', line: "15 cours de l'Intendance", city: 'Bordeaux', postalCode: '33000', country: 'France', lat: 44.8409, lng: -0.5793 },
  { id: 'a21', line: '2 place Gambetta', city: 'Bordeaux', postalCode: '33000', country: 'France', lat: 44.8407, lng: -0.5787 },
  { id: 'a22', line: '9 rue Faidherbe', city: 'Lille', postalCode: '59000', country: 'France', lat: 50.6314, lng: 3.0616 },
  { id: 'a23', line: '4 cours Franklin Roosevelt', city: 'Nantes', postalCode: '44000', country: 'France', lat: 47.2137, lng: -1.5561 },
  { id: 'a24', line: '11 rue de Metz', city: 'Toulouse', postalCode: '31000', country: 'France', lat: 43.6, lng: 1.4442 },
];

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** "12 rue Victor Hugo, 69002 Lyon" — matches the format used everywhere else in the app. */
export function formatAddress(a: AddressSuggestion): string {
  return `${a.line}, ${a.postalCode} ${a.city}`;
}

export function searchAddresses(query: string, limit = 5): AddressSuggestion[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  return MOCK_ADDRESSES.filter((a) => normalize(`${a.line} ${a.city} ${a.postalCode}`).includes(q)).slice(0, limit);
}

/** Live-formats digits into French pairs as the artisan types: "0612345678" → "06 12 34 56 78". */
export function formatPhoneFr(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  return (digits.match(/.{1,2}/g) ?? []).join(' ');
}

export const PAYMENT_METHODS = ['Espèces', 'Carte bancaire', 'Virement', 'Chèque'];

// ── VAT → company lookup ────────────────────────────────────────────────────

export type CompanyLookup = { name: string; address: string };

/**
 * Stand-in for a VIES / SIRENE lookup (same network block as the address
 * search above — recherche-entreprises.api.gouv.fr is free and keyless, and
 * would be the natural real source since a French VAT number's last 9 digits
 * are the company's SIREN, but it isn't reachable from this sandbox either).
 * Same shape a real call would return: { name, address } or nothing found.
 */
const MOCK_VAT_DIRECTORY: Record<string, CompanyLookup> = {
  FR32123456789: { name: 'Plomberie Générale SARL', address: '12 rue Victor Hugo, 69002 Lyon' },
  FR15987654321: { name: 'Élec Pro Rhône', address: '3 place Bellecour, 69002 Lyon' },
  FR76456789123: { name: 'Bâti Confort SAS', address: '45 cours Émile Zola, 69100 Villeurbanne' },
};

export function normalizeVat(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

/** French VAT shape: "FR" + 2-digit key + 9-digit SIREN. */
export function isValidFrenchVat(value: string): boolean {
  return /^FR\d{11}$/.test(normalizeVat(value));
}

export function lookupCompanyByVat(value: string): CompanyLookup | null {
  const key = normalizeVat(value);
  if (!isValidFrenchVat(key)) return null;
  return MOCK_VAT_DIRECTORY[key] ?? null;
}
