import { Priority } from '@/components/intervention/types';
import { formatShortDate } from '@/data/documents/date-utils';

/**
 * Mocked tasks dataset — independent from Rappels (which stays a read-only
 * aggregated view of things needing action across other modules). Tasks are
 * their own dedicated entity with full CRUD, same shape as
 * `data/plus/prestations.ts` so a real backend can replace this file later
 * without touching call sites.
 */
export type Task = {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string; // ISO date, optional
  priority: Priority;
  completed: boolean;
  createdAt: string; // ISO date
};

export const TASKS: Task[] = [
  {
    id: '1',
    title: 'Commander la pièce pour M. Dupont',
    notes: 'Raccord laiton 3/4" — chaudière',
    dueDate: new Date().toISOString(),
    priority: 'haute',
    completed: false,
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: '2',
    title: 'Mettre à jour l’attestation d’assurance',
    dueDate: new Date(Date.now() + 5 * 86_400_000).toISOString(),
    priority: 'normale',
    completed: false,
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  },
  {
    id: '3',
    title: 'Relancer Mme Garnier pour le devis climatisation',
    priority: 'basse',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    id: '4',
    title: 'Réserver le camion pour lundi',
    dueDate: new Date(Date.now() - 86_400_000).toISOString(),
    priority: 'normale',
    completed: true,
    createdAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
  },
];

export function getTaskById(id: string): Task | undefined {
  return TASKS.find((t) => t.id === id);
}

function nextTaskId(): string {
  const maxId = TASKS.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0);
  return String(maxId + 1);
}

export type TaskInput = { title: string; notes?: string; dueDate?: string; priority: Priority };

export function createTask(input: TaskInput): Task {
  const task: Task = { id: nextTaskId(), ...input, title: input.title.trim(), completed: false, createdAt: new Date().toISOString() };
  TASKS.unshift(task);
  return task;
}

export function updateTask(id: string, patch: Partial<TaskInput>): Task | undefined {
  const task = getTaskById(id);
  if (!task) return undefined;
  Object.assign(task, patch);
  return task;
}

export function deleteTask(id: string) {
  const index = TASKS.findIndex((t) => t.id === id);
  if (index !== -1) TASKS.splice(index, 1);
}

export function toggleTaskCompleted(id: string) {
  const task = getTaskById(id);
  if (task) task.completed = !task.completed;
}

export function formatTaskDue(dueDate?: string): { label: string; overdue: boolean } | null {
  if (!dueDate) return null;
  const days = Math.round((new Date(dueDate).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { label: 'En retard', overdue: true };
  if (days === 0) return { label: "Aujourd'hui", overdue: false };
  if (days === 1) return { label: 'Demain', overdue: false };
  return { label: formatShortDate(dueDate), overdue: false };
}
