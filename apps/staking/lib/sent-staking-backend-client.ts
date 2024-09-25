'use client';

import { createSessionStakingClient, SessionStakingClient } from '@session/sent-staking-js/client';
import {
  getStakingBackendQueryArgs,
  getStakingBackendQueryWithParamsArgs,
  type QueryOptions,
  StakingBackendQuery,
  StakingBackendQueryWithParams,
} from '@/lib/sent-staking-backend';
import { isProduction } from '@/lib/env';
import { useMemo } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

let client: SessionStakingClient | undefined;

function getStakingBackendBrowserClient() {
  if (client) {
    return client;
  }

  client = createSessionStakingClient({
    baseUrl: '/api/ssb',
    debug: !isProduction,
    errorOn404: !isProduction,
  });

  return client;
}

export function useStakingBackendBrowserClient() {
  return useMemo(getStakingBackendBrowserClient, []);
}

export function useStakingBackendSuspenseQuery<Q extends StakingBackendQuery>(query: Q) {
  const stakingBackendClient = useStakingBackendBrowserClient();
  return useSuspenseQuery<Awaited<ReturnType<Q>>['data']>({
    ...getStakingBackendQueryArgs(query),
    queryFn: async () => {
      const res = await query(stakingBackendClient);
      return res.data;
    },
  });
}

export function useStakingBackendQuery<Q extends StakingBackendQuery>(
  query: Q,
  queryOptions?: QueryOptions
) {
  const stakingBackendClient = useStakingBackendBrowserClient();
  return useQuery<Awaited<ReturnType<Q>>['data']>({
    ...getStakingBackendQueryArgs(query),
    ...queryOptions,
    queryFn: async () => {
      const res = await query(stakingBackendClient);
      return res.data;
    },
  });
}

export function useStakingBackendSuspenseQueryWithParams<Q extends StakingBackendQueryWithParams>(
  query: Q,
  params: Parameters<Q>[1]
) {
  const stakingBackendClient = useStakingBackendBrowserClient();
  return useSuspenseQuery<Awaited<ReturnType<Q>>['data']>({
    ...getStakingBackendQueryWithParamsArgs(query, params),
    queryFn: async () => {
      const res = await query(stakingBackendClient, params);
      return res.data;
    },
  });
}

export function useStakingBackendQueryWithParams<Q extends StakingBackendQueryWithParams>(
  query: Q,
  params: Parameters<Q>[1],
  queryOptions?: QueryOptions
) {
  const stakingBackendClient = useStakingBackendBrowserClient();
  return useQuery<Awaited<ReturnType<Q>>['data']>({
    ...getStakingBackendQueryWithParamsArgs(query, params),
    ...queryOptions,
    queryFn: async () => {
      const res = await query(stakingBackendClient, params);
      return res.data;
    },
  });
}
