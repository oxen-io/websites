import { SessionStakingClient } from '@session/sent-staking-js/client';

export async function getPendingNodes(
  client: SessionStakingClient,
  { address }: { address: string }
) {
  const [registrationsResponse, stakedNodesResponse] = await Promise.all([
    client.getOperatorRegistrations({ operator: address }),
    client.getStakesForWalletAddress({ address }),
  ]);

  if (registrationsResponse.data.registrations.length && stakedNodesResponse.data.stakes.length) {
    const stakedNodeIds = stakedNodesResponse.data.stakes.map((stake) => stake.service_node_pubkey);
    const pendingRegistrations = registrationsResponse.data.registrations.filter(
      (registration) => !stakedNodeIds.includes(registration.pubkey_ed25519)
    );
    return {
      ...registrationsResponse,
      data: { ...registrationsResponse.data, registrations: pendingRegistrations },
    };
  } else {
    return registrationsResponse;
  }
}
