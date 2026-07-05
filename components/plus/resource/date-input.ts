/** "12/03/2024" -> "2024-03-12", or null if not a valid french-format date. */
export function parseFrDateToIso(input: string): string | null {
  const match = input.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

/** "2024-03-12" -> "12/03/2024" */
export function formatIsoToFr(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
