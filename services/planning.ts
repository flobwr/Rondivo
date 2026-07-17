import * as PlanningData from '@/data/planning';
import { CalendarDay, DayScenario } from '@/components/planning/types';

export type WeekPlanning = {
  days: CalendarDay[];
  scenariosByDayIndex: Record<number, DayScenario>;
  selectedDayIndex: number;
  monthLabel: string;
};

export async function getWeekPlanning(): Promise<WeekPlanning> {
  return {
    days: [...PlanningData.CALENDAR_DAYS],
    scenariosByDayIndex: PlanningData.DAY_SCENARIOS_BY_INDEX,
    selectedDayIndex: PlanningData.SELECTED_DAY_INDEX,
    monthLabel: PlanningData.PLANNING_MONTH_LABEL,
  };
}
