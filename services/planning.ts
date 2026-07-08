import * as PlanningData from '@/data/planning';
import { CalendarDay, DayItem } from '@/components/planning/types';

export type WeekPlanning = {
  days: CalendarDay[];
  itemsByDayIndex: Record<number, DayItem[]>;
  selectedDayIndex: number;
  monthLabel: string;
};

export async function getWeekPlanning(): Promise<WeekPlanning> {
  return {
    days: [...PlanningData.CALENDAR_DAYS],
    itemsByDayIndex: PlanningData.DAY_ITEMS_BY_INDEX,
    selectedDayIndex: PlanningData.SELECTED_DAY_INDEX,
    monthLabel: PlanningData.PLANNING_MONTH_LABEL,
  };
}
