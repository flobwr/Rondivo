import * as VehiclesData from '@/data/plus/vehicles';

export type { Vehicle, VehicleInput, VehicleStatus, VehicleType } from '@/data/plus/vehicles';
export {
  VEHICLE_STATUS_META,
  VEHICLE_STATUS_ORDER,
  VEHICLE_TYPE_LABEL,
  VEHICLE_TYPE_ORDER,
} from '@/data/plus/vehicles';

export async function listVehicles(): Promise<VehiclesData.Vehicle[]> {
  return [...VehiclesData.VEHICLES];
}

export async function getVehicle(id: string): Promise<VehiclesData.Vehicle | undefined> {
  return VehiclesData.getVehicleById(id);
}

export async function createVehicle(input: VehiclesData.VehicleInput): Promise<VehiclesData.Vehicle> {
  return VehiclesData.createVehicle(input);
}

export async function updateVehicle(
  id: string,
  patch: Partial<VehiclesData.VehicleInput>
): Promise<VehiclesData.Vehicle | undefined> {
  return VehiclesData.updateVehicle(id, patch);
}

export async function deleteVehicle(id: string): Promise<void> {
  VehiclesData.deleteVehicle(id);
}
