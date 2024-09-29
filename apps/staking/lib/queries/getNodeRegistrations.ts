import { SessionStakingClient } from '@session/sent-staking-js/client';

export async function getNodeRegistrations(
  client: SessionStakingClient,
  { address }: { address: string }
) {
  return client.getOperatorRegistrations({ operator: address });
}
