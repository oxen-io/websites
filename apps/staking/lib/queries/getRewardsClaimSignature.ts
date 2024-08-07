import { SessionStakingClient } from '@session/sent-staking-js/client';

export function getRewardsClaimSignature(
  client: SessionStakingClient,
  { address }: { address: string }
) {
  return client.getRewardsClaimSignature({ address });
}
