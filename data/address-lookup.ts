import type { AddressSuggestion } from '@/components/clients/new/address-provider';

/**
 * Local stand-in for the French national address API (api-adresse.data.gouv.fr
 * — free and keyless, the natural real source for a France-focused dataset)
 * or Google Places/Mapbox/HERE. This sandbox's outbound network policy blocks
 * those hosts at the gateway (confirmed: 403 on CONNECT to
 * api-adresse.data.gouv.fr), so nothing live is reachable from here. The
 * shape matches a real geocoder response, GPS included, so this is a today-
 * only implementation of `AddressProvider`, not a workaround baked into the field.
 */
export const MOCK_ADDRESSES: AddressSuggestion[] = [
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
