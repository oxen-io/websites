import 'server-only';

import {
  SSBRequestOptions,
  SSBResponse,
  SessionStakingClient,
  SessionStakingClientMethodResponseMap,
  createSessionStakingClient,
} from '@session/sent-staking-js/client';
import { QueryClient } from '@tanstack/react-query';
import { NEXT_PUBLIC_SENT_STAKING_API_URL } from './env';

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

export const createSessionStakingServerClient = () =>
  createSessionStakingClient({ baseUrl: NEXT_PUBLIC_SENT_STAKING_API_URL, request });

export async function sessionStakingPrefetchQuery<Q extends keyof SessionStakingClient>({
  query,
  args,
}: {
  query: Q;
  args: Parameters<SessionStakingClient[Q]>[0];
}) {
  const sentStakingClient = createSessionStakingServerClient();

  const queryFn = async () => {
    // TODO - Look into proper typing for the inputs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await sentStakingClient[query](args as any);
    return response.body as SessionStakingClientMethodResponseMap[Q];
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [query, args],
    queryFn,
  });

  return { queryClient };
}
