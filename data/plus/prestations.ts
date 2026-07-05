export type PrestationUnit = 'heure' | 'forfait' | 'm2' | 'unite';

export type Prestation = {
  id: string;
  name: string;
  unitPrice: number;
  unit: PrestationUnit;
};

export const PRESTATION_UNIT_LABEL: Record<PrestationUnit, string> = {
  heure: '/ heure',
  forfait: 'forfait',
  m2: '/ m²',
  unite: '/ unité',
};

export const PRESTATION_UNIT_ORDER: PrestationUnit[] = ['heure', 'forfait', 'm2', 'unite'];

export const PRESTATIONS: Prestation[] = [
  { id: '1', name: 'Main d’œuvre chauffagiste', unitPrice: 55, unit: 'heure' },
  { id: '2', name: 'Entretien chaudière annuel', unitPrice: 120, unit: 'forfait' },
  { id: '3', name: 'Dépannage urgence', unitPrice: 90, unit: 'forfait' },
  { id: '4', name: 'Pose de radiateur', unitPrice: 180, unit: 'unite' },
];

export function getPrestationById(id: string): Prestation | undefined {
  return PRESTATIONS.find((p) => p.id === id);
}

function nextPrestationId(): string {
  const maxId = PRESTATIONS.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
  return String(maxId + 1);
}

export type PrestationInput = { name: string; unitPrice: number; unit: PrestationUnit };

export function createPrestation(input: PrestationInput): Prestation {
  const prestation: Prestation = { id: nextPrestationId(), ...input, name: input.name.trim() };
  PRESTATIONS.unshift(prestation);
  return prestation;
}

export function updatePrestation(id: string, patch: Partial<PrestationInput>): Prestation | undefined {
  const prestation = getPrestationById(id);
  if (!prestation) return undefined;
  Object.assign(prestation, patch);
  return prestation;
}

export function deletePrestation(id: string) {
  const index = PRESTATIONS.findIndex((p) => p.id === id);
  if (index !== -1) PRESTATIONS.splice(index, 1);
}
