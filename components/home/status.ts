import { getDepartureState, parseTimeToMinutes } from '@/components/home/time';
import { Intervention } from '@/components/intervention/types';

export type StatusTone = 'urgent' | 'warning' | 'active' | 'default' | 'quiet';

export type HomeStatus = {
  label: string;
  tone: StatusTone;
};

/**
 * The Home masthead's ONE line under the greeting — always exactly one
 * fact, always the most important one. Priority, most urgent first:
 *
 *   1. On-site right now            → "Intervention en cours"
 *   2. Missed the advised departure → "Départ dépassé"
 *   3. Leave-now window              → "Partez maintenant"
 *   4. Still counting down           → "Départ conseillé dans 8 h"
 *   5. Nothing left today, but rappels pending → "3 rappels importants"
 *   6. Nothing left today, no rappels → "Journée terminée"
 *   7. No intervention at all today  → "Aucune intervention aujourd'hui"
 */
export function getHomeStatus({
  nowMin,
  hasNextIntervention,
  nextIntervention,
  interventionsTodayCount,
  reminderCount,
}: {
  nowMin: number;
  hasNextIntervention: boolean;
  nextIntervention?: Intervention;
  interventionsTodayCount: number;
  reminderCount: number;
}): HomeStatus {
  if (hasNextIntervention && nextIntervention) {
    const startMin = parseTimeToMinutes(nextIntervention.startTime);
    const endMin = parseTimeToMinutes(nextIntervention.endTime);

    if (nowMin >= startMin && nowMin <= endMin) {
      return { label: 'Intervention en cours', tone: 'active' };
    }

    const departureMin = startMin - nextIntervention.travelMinutes;
    const departure = getDepartureState(departureMin, startMin, nowMin);

    if (departure.phase === 'late') return { label: 'Départ dépassé', tone: 'urgent' };
    if (departure.phase === 'leave') return { label: 'Partez maintenant', tone: 'warning' };
    return { label: `Départ conseillé ${departure.label}`, tone: 'default' };
  }

  if (reminderCount > 0) {
    return {
      label: reminderCount === 1 ? '1 rappel important' : `${reminderCount} rappels importants`,
      tone: 'default',
    };
  }

  if (interventionsTodayCount > 0) {
    return { label: 'Journée terminée', tone: 'quiet' };
  }

  return { label: 'Aucune intervention aujourd’hui', tone: 'quiet' };
}
