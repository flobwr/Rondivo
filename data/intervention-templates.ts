import { type FeatherIconName, type Tint } from '@/components/clients/types';

/**
 * Intervention templates — the single biggest time-saver on the "new
 * appointment" screen. Picking one prefills title, category, duration, price
 * and VAT in a single tap, so the artisan almost never types a number.
 *
 * When a backend lands, only this array changes; the screen reads templates
 * through {@link INTERVENTION_TEMPLATES} / {@link getTemplateById}.
 */
export type InterventionTemplate = {
  id: string;
  name: string;
  category: string;
  icon: FeatherIconName;
  tint: Tint;
  durationMinutes: number;
  price: number; // HT, in euros
  tvaRate: number; // 10 or 20
};

export const INTERVENTION_TEMPLATES: InterventionTemplate[] = [
  { id: 'maintenance', name: 'Entretien chaudière', category: 'Chauffage', icon: 'thermometer', tint: 'red', durationMinutes: 90, price: 120, tvaRate: 10 },
  { id: 'leak', name: 'Dépannage fuite', category: 'Plomberie', icon: 'droplet', tint: 'blue', durationMinutes: 60, price: 90, tvaRate: 10 },
  { id: 'radiator', name: 'Installation radiateur', category: 'Chauffage', icon: 'thermometer', tint: 'orange', durationMinutes: 120, price: 260, tvaRate: 20 },
  { id: 'waterheater', name: 'Remplacement chauffe-eau', category: 'Plomberie', icon: 'droplet', tint: 'blue', durationMinutes: 180, price: 480, tvaRate: 10 },
  { id: 'panel', name: 'Tableau électrique', category: 'Électricité', icon: 'zap', tint: 'purple', durationMinutes: 120, price: 300, tvaRate: 20 },
  { id: 'diagnostic', name: 'Diagnostic', category: 'Diagnostic', icon: 'search', tint: 'green', durationMinutes: 60, price: 70, tvaRate: 20 },
];

export function getTemplateById(id: string | undefined): InterventionTemplate | undefined {
  if (!id) return undefined;
  return INTERVENTION_TEMPLATES.find((t) => t.id === id);
}
