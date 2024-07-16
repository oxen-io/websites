import { SessionStakingClient, StakingBackendResponse } from '@session/sent-staking-js/client';

export type StakingBackendQuery = (
  stakingBackendClient: SessionStakingClient
) => Promise<StakingBackendResponse<unknown>>;

export type StakingBackendQueryWithParams = (
  stakingBackendClient: SessionStakingClient,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: resolve proper type
  params: any
) => Promise<StakingBackendResponse<unknown>>;

export function getStakingBackendQueryArgs<Q extends StakingBackendQuery>(query: Q) {
  return {
    queryKey: [query.name],
  };
}

export function getStakingBackendQueryWithParamsArgs<Q extends StakingBackendQueryWithParams>(
  query: Q,
  params: Parameters<Q>[1]
) {
  return {
    queryKey: [query.name, params.toString()],
  };
}
