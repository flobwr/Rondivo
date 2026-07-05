/** Formats a whole-euro amount the way the mockups show it: "12 540 €". */
export function formatEuro(amount: number): string {
  const rounded = Math.round(amount);
  const withSpaces = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${withSpaces} €`;
}
