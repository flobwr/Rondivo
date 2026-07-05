export type VehicleType = 'utilitaire' | 'camionnette' | 'voiture' | 'fourgon';
export type VehicleStatus = 'disponible' | 'en-intervention' | 'maintenance';

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  type: VehicleType;
  status: VehicleStatus;
  assignedToId?: string;
  mileage: number;
  nextServiceDate?: string; // ISO
};

export const VEHICLE_TYPE_LABEL: Record<VehicleType, string> = {
  utilitaire: 'Utilitaire',
  camionnette: 'Camionnette',
  voiture: 'Voiture',
  fourgon: 'Fourgon',
};

export const VEHICLE_TYPE_ORDER: VehicleType[] = ['fourgon', 'utilitaire', 'camionnette', 'voiture'];

export const VEHICLE_STATUS_META: Record<VehicleStatus, { label: string; color: string; soft: string }> = {
  disponible: { label: 'Disponible', color: '#10B981', soft: '#E4F6EE' },
  'en-intervention': { label: 'En intervention', color: '#2563EB', soft: '#EAF1FE' },
  maintenance: { label: 'En entretien', color: '#F59E0B', soft: '#FEF1DC' },
};

export const VEHICLE_STATUS_ORDER: VehicleStatus[] = ['disponible', 'en-intervention', 'maintenance'];

export const VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Renault Trafic',
    plate: 'AB-123-CD',
    type: 'fourgon',
    status: 'en-intervention',
    assignedToId: '1',
    mileage: 68000,
    nextServiceDate: '2026-09-15',
  },
  {
    id: '2',
    name: 'Citroën Berlingo',
    plate: 'EF-456-GH',
    type: 'utilitaire',
    status: 'disponible',
    assignedToId: '3',
    mileage: 42500,
    nextServiceDate: '2026-11-02',
  },
];

export function getVehicleById(id: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}

function nextVehicleId(): string {
  const maxId = VEHICLES.reduce((max, v) => Math.max(max, Number(v.id) || 0), 0);
  return String(maxId + 1);
}

export type VehicleInput = {
  name: string;
  plate: string;
  type: VehicleType;
  status: VehicleStatus;
  assignedToId?: string;
  mileage: number;
  nextServiceDate?: string;
};

export function createVehicle(input: VehicleInput): Vehicle {
  const vehicle: Vehicle = { id: nextVehicleId(), ...input, name: input.name.trim(), plate: input.plate.trim() };
  VEHICLES.unshift(vehicle);
  return vehicle;
}

export function updateVehicle(id: string, patch: Partial<VehicleInput>): Vehicle | undefined {
  const vehicle = getVehicleById(id);
  if (!vehicle) return undefined;
  Object.assign(vehicle, patch);
  return vehicle;
}

export function deleteVehicle(id: string) {
  const index = VEHICLES.findIndex((v) => v.id === id);
  if (index !== -1) VEHICLES.splice(index, 1);
}
