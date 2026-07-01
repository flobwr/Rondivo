import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value`. The Clients search field updates
 * instantly (so typing feels immediate) while the query that drives fetching
 * only changes once the user pauses — exactly what a server-backed search wants.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
