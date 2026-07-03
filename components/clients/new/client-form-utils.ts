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
};

/**
 * Stand-in for a Google Places / Radar autocomplete call. No backend or API
 * key is wired up in this project yet, so this mimics the real interaction
 * (type-ahead, structured result, tap to fill) against a small local dataset.
 * Swapping in a real provider later only means replacing this function's body
 * — every call site already treats it as async-shaped, structured data.
 */
const MOCK_ADDRESSES: AddressSuggestion[] = [
  { id: 'a1', line: '12 rue Victor Hugo', city: 'Lyon', postalCode: '69002', country: 'France' },
  { id: 'a2', line: '3 place Bellecour', city: 'Lyon', postalCode: '69002', country: 'France' },
  { id: 'a3', line: '24 rue de Mons', city: 'Lyon', postalCode: '69003', country: 'France' },
  { id: 'a4', line: '5 cours Lafayette', city: 'Lyon', postalCode: '69003', country: 'France' },
  { id: 'a5', line: '2 place des Terreaux', city: 'Lyon', postalCode: '69001', country: 'France' },
  { id: 'a6', line: '17 quai Saint-Antoine', city: 'Lyon', postalCode: '69002', country: 'France' },
  { id: 'a7', line: '9 rue Childebert', city: 'Lyon', postalCode: '69002', country: 'France' },
  { id: 'a8', line: '77 rue Duguesclin', city: 'Lyon', postalCode: '69006', country: 'France' },
  { id: 'a9', line: '29 rue Garibaldi', city: 'Lyon', postalCode: '69006', country: 'France' },
  { id: 'a10', line: '14 montée de la Grande Côte', city: 'Lyon', postalCode: '69001', country: 'France' },
  { id: 'a11', line: '61 rue de Marseille', city: 'Lyon', postalCode: '69007', country: 'France' },
  { id: 'a12', line: '8 rue de la République', city: 'Lyon', postalCode: '69001', country: 'France' },
  { id: 'a13', line: '45 cours Émile Zola', city: 'Villeurbanne', postalCode: '69100', country: 'France' },
  { id: 'a14', line: '18 rue du 4 Août', city: 'Villeurbanne', postalCode: '69100', country: 'France' },
  { id: 'a15', line: '10 rue de Rivoli', city: 'Paris', postalCode: '75004', country: 'France' },
  { id: 'a16', line: '22 avenue des Champs-Élysées', city: 'Paris', postalCode: '75008', country: 'France' },
  { id: 'a17', line: '5 boulevard Saint-Germain', city: 'Paris', postalCode: '75005', country: 'France' },
  { id: 'a18', line: '30 la Canebière', city: 'Marseille', postalCode: '13001', country: 'France' },
  { id: 'a19', line: '7 rue Paradis', city: 'Marseille', postalCode: '13001', country: 'France' },
  { id: 'a20', line: "15 cours de l'Intendance", city: 'Bordeaux', postalCode: '33000', country: 'France' },
  { id: 'a21', line: '2 place Gambetta', city: 'Bordeaux', postalCode: '33000', country: 'France' },
  { id: 'a22', line: '9 rue Faidherbe', city: 'Lille', postalCode: '59000', country: 'France' },
  { id: 'a23', line: '4 cours Franklin Roosevelt', city: 'Nantes', postalCode: '44000', country: 'France' },
  { id: 'a24', line: '11 rue de Metz', city: 'Toulouse', postalCode: '31000', country: 'France' },
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
