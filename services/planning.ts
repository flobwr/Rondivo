import * as PlanningData from '@/data/planning';
import { CalendarDay, DayScenario } from '@/components/planning/types';

export type WeekPlanning = {
  days: CalendarDay[];
  scenariosByDayIndex: Record<number, DayScenario>;
  selectedDayIndex: number;
  monthLabel: string;
};

export async function getWeekPlanning(): Promise<WeekPlanning> {
  const scenariosByDayIndex = PlanningData.DAY_SCENARIOS_BY_INDEX;

  // The strip's activity dot is a *view* of the day's scenario, so it is
  // derived here rather than authored alongside the dates — a day can never
  // claim to hold work it doesn't have.
  const days: CalendarDay[] = PlanningData.CALENDAR_DAYS.map((day, index) => ({
    ...day,
    hasInterventions: (scenariosByDayIndex[index]?.items ?? []).some(
      (item) => item.kind === 'intervention'
    ),
  }));

  return {
    days,
    scenariosByDayIndex,
    selectedDayIndex: PlanningData.SELECTED_DAY_INDEX,
    monthLabel: PlanningData.PLANNING_MONTH_LABEL,
  };
}
