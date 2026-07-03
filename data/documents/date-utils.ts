const SHORT_DATE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
const LONG_DATE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export function formatShortDate(iso: string): string {
  return SHORT_DATE.format(new Date(iso));
}

export function formatLongDate(iso: string): string {
  return LONG_DATE.format(new Date(iso));
}

/** Whole days between `iso` and now — positive when `iso` is in the past. */
export function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / 86_400_000);
}

export function formatAmount(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} €`;
}
