import { daysSince, formatShortDate } from '@/data/documents/date-utils';

/**
 * Mocked notes dataset — a stand-in for a future notes API. `createNote`/
 * `updateNote`/`deleteNote` mutate this array in place, the same shape as
 * `data/plus/prestations.ts`, so swapping in a real backend later only
 * touches this file.
 */
export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string; // ISO date
};

export const NOTES: Note[] = [
  {
    id: '1',
    title: 'Accès chantier Mme Bernard',
    content: 'Code portail 4521B, sonner chez le voisin si pas de réponse.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Fournisseur — délai de livraison',
    content: 'Groupe de sécurité 7 bar en rupture, réassort prévu sous 5 jours.',
    updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: '3',
    title: 'Idée — modèle de devis rénovation',
    content: 'Regrouper main-d’œuvre et fournitures par pièce plutôt que par ligne, pour que le client visualise le coût par pièce rénovée.',
    updatedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
  },
];

export function formatNoteDate(updatedAt: string): string {
  const days = daysSince(updatedAt);
  if (days <= 0) return 'Aujourd’hui';
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  return formatShortDate(updatedAt);
}

export function getNoteById(id: string): Note | undefined {
  return NOTES.find((n) => n.id === id);
}

function nextNoteId(): string {
  const maxId = NOTES.reduce((max, n) => Math.max(max, Number(n.id) || 0), 0);
  return String(maxId + 1);
}

export type NoteInput = { title: string; content: string };

export function createNote(input: NoteInput): Note {
  const note: Note = { id: nextNoteId(), title: input.title.trim(), content: input.content.trim(), updatedAt: new Date().toISOString() };
  NOTES.unshift(note);
  return note;
}

export function updateNote(id: string, patch: Partial<NoteInput>): Note | undefined {
  const note = getNoteById(id);
  if (!note) return undefined;
  Object.assign(note, patch, { updatedAt: new Date().toISOString() });
  return note;
}

export function deleteNote(id: string) {
  const index = NOTES.findIndex((n) => n.id === id);
  if (index !== -1) NOTES.splice(index, 1);
}
