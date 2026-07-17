import * as RemindersData from '@/data/reminders';

export type { ReminderIconFamily, ReminderItem, ReminderSection, ReminderSummary } from '@/data/reminders';

export async function listReminderSections(): Promise<RemindersData.ReminderSection[]> {
  return [...RemindersData.REMINDER_SECTIONS];
}

export async function getNextReminderTitle(): Promise<string | null> {
  return RemindersData.getNextReminderTitle();
}

export async function getReminderSummary(): Promise<RemindersData.ReminderSummary> {
  return RemindersData.getReminderSummary();
}
