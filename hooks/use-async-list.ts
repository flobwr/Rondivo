import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

export type AsyncStatus = 'loading' | 'refreshing' | 'error' | 'success';

/**
 * Generic list-fetching hook for any `services/*.ts` function. Refetches on
 * screen focus (so a create/edit done on a pushed screen is reflected when
 * coming back) and distinguishes the first load (`loading`, shows a skeleton)
 * from a refetch of already-loaded data (`refreshing`, keeps showing the old
 * list while the new one comes in) — the same distinction `useClients`
 * already makes for the Clients screen.
 *
 * `fetcher` must be stable (wrap it in `useCallback` at the call site).
 */
export function useAsyncList<T>(fetcher: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const hasLoadedOnceRef = useRef(false);

  const load = useCallback(() => {
    setStatus(hasLoadedOnceRef.current ? 'refreshing' : 'loading');
    fetcher()
      .then((result) => {
        setData(result);
        setStatus('success');
        setError(null);
        hasLoadedOnceRef.current = true;
      })
      .catch((err) => {
        setStatus('error');
        setError(err instanceof Error ? err : new Error(String(err)));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { data, status, error, refresh: load, setData };
}
