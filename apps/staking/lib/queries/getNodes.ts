import { SessionStakingClient } from '@session/sent-staking-js/client';

export async function getNodes(client: SessionStakingClient) {
  return client.getNodes();
}
