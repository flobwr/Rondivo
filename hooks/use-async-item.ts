import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { AsyncStatus } from './use-async-list';

/**
 * Generic single-record fetching hook — the detail-screen counterpart of
 * `useAsyncList`. Refetches on focus and whenever `fetcher` changes identity
 * (e.g. the id in its closure changed), so `fetcher` must be memoized with
 * `useCallback([id])` at the call site.
 */
export function useAsyncItem<T>(fetcher: () => Promise<T | undefined>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    setStatus((prev) => (prev === 'success' ? 'refreshing' : 'loading'));
    fetcher()
      .then((result) => {
        setData(result);
        setStatus('success');
        setError(null);
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

  return { data, status, error, refresh: load };
}
