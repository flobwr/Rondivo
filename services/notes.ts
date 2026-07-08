/**
 * Async facade over `data/notes.ts` — the only thing screens should import
 * for notes. Today it just wraps the mock array; swapping in Supabase later
 * means rewriting the inside of these functions only, no screen changes.
 */
import * as NotesData from '@/data/notes';

export type { Note, NoteInput } from '@/data/notes';
export { formatNoteDate } from '@/data/notes';

export async function listNotes(): Promise<NotesData.Note[]> {
  return [...NotesData.NOTES];
}

export async function getNote(id: string): Promise<NotesData.Note | undefined> {
  return NotesData.getNoteById(id);
}

export async function createNote(input: NotesData.NoteInput): Promise<NotesData.Note> {
  return NotesData.createNote(input);
}

export async function updateNote(id: string, patch: Partial<NotesData.NoteInput>): Promise<NotesData.Note | undefined> {
  return NotesData.updateNote(id, patch);
}

export async function deleteNote(id: string): Promise<void> {
  NotesData.deleteNote(id);
}
