import { SessionStakingClient } from '@session/sent-staking-js/client';

export function getNodeExitSignatures(
  client: SessionStakingClient,
  { nodePubKey }: { nodePubKey: string }
) {
  return client.getNodeExitSignatures({ nodePubKey });
}
