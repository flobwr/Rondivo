import * as HomeScheduleData from '@/data/home-schedule';
import { Appointment } from '@/components/home/types';

export type HomeSchedule = {
  hasNextIntervention: boolean;
  nextInterventionId: string;
  remainingAppointments: Appointment[];
  interventionsTodayCount: number;
};

export async function getHomeSchedule(): Promise<HomeSchedule> {
  return {
    hasNextIntervention: HomeScheduleData.HAS_NEXT_INTERVENTION,
    nextInterventionId: HomeScheduleData.NEXT_INTERVENTION_ID,
    remainingAppointments: [...HomeScheduleData.REMAINING_APPOINTMENTS],
    interventionsTodayCount: HomeScheduleData.HOME_INTERVENTIONS_TODAY_COUNT,
  };
}
