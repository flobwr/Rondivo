/**
 * Async facade over `data/intervention-templates.ts`. The template catalogue
 * is static today; wrapping it here means the appointment-creation screen
 * never needs to change when templates start coming from a real backend.
 */
import * as InterventionTemplatesData from '@/data/intervention-templates';

export type { InterventionTemplate } from '@/data/intervention-templates';

export async function listInterventionTemplates(): Promise<InterventionTemplatesData.InterventionTemplate[]> {
  return [...InterventionTemplatesData.INTERVENTION_TEMPLATES];
}

export async function getInterventionTemplate(
  id: string | undefined
): Promise<InterventionTemplatesData.InterventionTemplate | undefined> {
  return InterventionTemplatesData.getTemplateById(id);
}
