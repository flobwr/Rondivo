import { useCallback, useState } from 'react';

/**
 * useState whose value is remembered across mounts/navigation within the session.
 *
 * Values live in a module-level cache keyed by a stable string, so leaving the
 * Clients screen and coming back preserves things like the selected sort. The
 * signature mirrors `useState`, which means the day we want the preference to
 * survive a cold start we can back this cache with AsyncStorage/MMKV in one
 * place — no call site changes.
 */
const cache = new Map<string, unknown>();

export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() =>
    cache.has(key) ? (cache.get(key) as T) : initialValue
  );

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        cache.set(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, set] as const;
}
