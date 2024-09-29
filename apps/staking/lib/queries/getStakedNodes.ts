import { SessionStakingClient } from '@session/sent-staking-js/client';

export function getStakedNodes(client: SessionStakingClient, { address }: { address: string }) {
  return client.getStakesForWalletAddress({ address });
}
