import 'server-only';

import { createSessionStakingClient } from '@session/sent-staking-js/client';
import { isProduction, NEXT_PUBLIC_SENT_STAKING_API_URL } from '@/lib/env';
import { getStakingBackendQueryArgs, StakingBackendQuery } from '@/lib/sent-staking-backend';
import { createQueryClient } from '@/lib/query';
import { logger } from '@/lib/logger';

export const createSessionStakingServerClient = () =>
  createSessionStakingClient({
    baseUrl: NEXT_PUBLIC_SENT_STAKING_API_URL,
    debug: !isProduction,
    logger,
  });

export function stakingBackendPrefetchQuery<Q extends StakingBackendQuery>(query: Q) {
  const stakingBackendClient = createSessionStakingServerClient();

  const queryClient = createQueryClient();

  queryClient.prefetchQuery<Awaited<ReturnType<Q>>['data']>({
    ...getStakingBackendQueryArgs(query),
    queryFn: async () => {
      const res = await query(stakingBackendClient);
      return res.data;
    },
  });

  return { queryClient };
}
