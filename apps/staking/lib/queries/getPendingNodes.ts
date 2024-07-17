import { SessionStakingClient } from '@session/sent-staking-js/client';

export async function getPendingNodes(
  client: SessionStakingClient,
  { address }: { address: string }
) {
  const [registrationsResponse, stakedNodesResponse] = await Promise.all([
    client.getOperatorRegistrations({ operator: address }),
    client.getNodesForEthWallet({ address }),
  ]);

  if (registrationsResponse.data.registrations.length && stakedNodesResponse.data.nodes.length) {
    console.log('reg', registrationsResponse);
    console.log('stake', stakedNodesResponse);
    const stakedNodeIds = stakedNodesResponse.data.nodes.map((node) => node.service_node_pubkey);
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
