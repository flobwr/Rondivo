import { useCallback, useEffect, useRef, useState } from 'react';

import { type Client } from '@/components/clients/types';
import { fetchClientsPage, type ClientQuery } from '@/data/clients';

export type ClientsStatus = 'loading' | 'refreshing' | 'error' | 'success';

export type UseClientsResult = {
  clients: Client[];
  status: ClientsStatus;
  /** First-page load with no data yet — drives the skeleton. */
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  total: number;
  error: boolean;
  refresh: () => void;
  loadMore: () => void;
  retry: () => void;
};

/**
 * Owns everything data-related for the Clients screen: paginated fetching,
 * pull-to-refresh, infinite scroll and error handling. The screen stays a dumb
 * consumer, so this hook can later wrap React Query / a Supabase client without
 * the UI noticing.
 *
 * A change to `query` (search, filters or sort) transparently resets to page 1.
 */
export function useClients(query: ClientQuery): UseClientsResult {
  const [clients, setClients] = useState<Client[]>([]);
  const [status, setStatus] = useState<ClientsStatus>('loading');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Serialised so effect deps stay primitive and re-fetch only on real changes.
  const queryKey = `${query.search}::${query.statuses.join(',')}::${query.sort}`;
  const pageRef = useRef(1);
  // Guards against out-of-order responses when the query changes mid-flight.
  const requestRef = useRef(0);

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'more') => {
      const requestId = ++requestRef.current;
      const nextPage = mode === 'more' ? pageRef.current + 1 : 1;

      if (mode === 'more') setIsLoadingMore(true);
      else {
        setStatus(mode === 'refresh' ? 'refreshing' : 'loading');
        setHasMore(false);
      }

      try {
        const result = await fetchClientsPage(query, nextPage);
        if (requestId !== requestRef.current) return; // stale response — discard

        pageRef.current = result.page;
        setTotal(result.total);
        setHasMore(result.hasMore);
        setClients((prev) => (mode === 'more' ? [...prev, ...result.items] : result.items));
        setStatus('success');
      } catch {
        if (requestId !== requestRef.current) return;
        if (mode === 'more') {
          // A failed page-in is non-fatal — keep what we already have.
        } else {
          setClients([]);
          setStatus('error');
        }
      } finally {
        if (requestId === requestRef.current && mode === 'more') setIsLoadingMore(false);
      }
    },
    // `query` is captured through queryKey so the callback is stable per query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryKey]
  );

  useEffect(() => {
    load('initial');
  }, [load]);

  const refresh = useCallback(() => {
    if (status === 'loading') return;
    load('refresh');
  }, [load, status]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || status !== 'success') return;
    load('more');
  }, [hasMore, isLoadingMore, status, load]);

  const retry = useCallback(() => load('initial'), [load]);

  return {
    clients,
    status,
    isInitialLoading: status === 'loading',
    isRefreshing: status === 'refreshing',
    isLoadingMore,
    hasMore,
    total,
    error: status === 'error',
    refresh,
    loadMore,
    retry,
  };
}
