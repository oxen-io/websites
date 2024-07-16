import { SessionStakingClient } from '@session/sent-staking-js/client';

export function getOpenNodes(client: SessionStakingClient) {
  return client.getOpenNodes();
}
