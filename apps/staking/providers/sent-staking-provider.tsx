'use client';

import {
  SSBRequestOptions,
  SSBResponse,
  SessionStakingClientMethodResponseMap,
  createSessionStakingClient,
  type SessionStakingClient,
} from '@session/sent-staking-js/client';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState } from 'react';

type SentStakingClientContext = {
  sentStakingClient: SessionStakingClient;
};

const Context = createContext<SentStakingClientContext | undefined>(undefined);

async function request<T>(options: SSBRequestOptions): Promise<SSBResponse<T>> {
  const { status, statusText, json } = await fetch(options.url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return {
    status,
    statusText,
    body: await json(),
  };
}

export default function SentStakingClientProvider({ children }: { children: React.ReactNode }) {
  const [sentStakingClient] = useState(() =>
    createSessionStakingClient({ baseUrl: '/api/sent', request })
  );

  return <Context.Provider value={{ sentStakingClient }}>{children}</Context.Provider>;
}

export const useSentStakingClient = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSentStakingClient must be used inside sentStakingClientProvider');
  }

  return context;
};

export enum QUERY_STATUS {
  PENDING,
  LOADING,
  SUCCESS,
  ERROR,
}

const parseQueryStatus = ({
  isPending,
  isLoading,
  isSuccess,
  isError,
}: {
  isPending: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}) => {
  if (isError) return QUERY_STATUS.ERROR;
  if (isSuccess) return QUERY_STATUS.SUCCESS;
  if (isLoading) return QUERY_STATUS.LOADING;
  if (isPending) return QUERY_STATUS.PENDING;
  return QUERY_STATUS.PENDING;
};

export function useSessionStakingQuery<Q extends keyof SessionStakingClient>({
  query,
  args,
}: {
  query: Q;
  args: Parameters<SessionStakingClient[Q]>[0];
}) {
  const { sentStakingClient } = useSentStakingClient();

  const queryFn = async () => {
    // TODO - Look into proper typing for the inputs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await sentStakingClient[query](args as any);
    return response.body as SessionStakingClientMethodResponseMap[Q];
  };

  const { isLoading, isPending, isError, isSuccess, ...rest } = useQuery({
    queryKey: [query, args],
    queryFn,
  });

  const status = useMemo(
    () => parseQueryStatus({ isPending, isLoading, isSuccess, isError }),
    [isLoading, isPending, isError, isSuccess]
  );

  return { isLoading, isPending, isError, isSuccess, ...rest, status };
}
