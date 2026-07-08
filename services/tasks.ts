import * as TasksData from '@/data/tasks';

export type { Task, TaskInput } from '@/data/tasks';
export { formatTaskDue } from '@/data/tasks';

export async function listTasks(): Promise<TasksData.Task[]> {
  return [...TasksData.TASKS];
}

export async function getTask(id: string): Promise<TasksData.Task | undefined> {
  return TasksData.getTaskById(id);
}

export async function createTask(input: TasksData.TaskInput): Promise<TasksData.Task> {
  return TasksData.createTask(input);
}

export async function updateTask(id: string, patch: Partial<TasksData.TaskInput>): Promise<TasksData.Task | undefined> {
  return TasksData.updateTask(id, patch);
}

export async function deleteTask(id: string): Promise<void> {
  TasksData.deleteTask(id);
}

export async function toggleTaskCompleted(id: string): Promise<void> {
  TasksData.toggleTaskCompleted(id);
}
