import { SessionStakingClient } from '@session/sent-staking-js/client';

export function getPendingNodes(client: SessionStakingClient, { address }: { address: string }) {
  return client.getOperatorRegistrations({ operator: address });
}
