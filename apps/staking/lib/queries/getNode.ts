import { parseSessionNodeData } from '@/app/mystakes/modules/StakedNodesModule';
import { NODE_STATE } from '@session/sent-staking-js/client';

// TODO: refactor this to use a generic explorer client
export async function getNode({ address }: { address: string }) {
  const data = {
    jsonrpc: '2.0',
    id: '0',
    method: 'get_service_nodes',
    params: {
      all: true,
      service_node_pubkeys: [address],
    },
  };

  try {
    const response = await fetch('/api/explorer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();

    const node = res.result.service_node_states[0];

    const currentBlock = res.result.height;

    return node
      ? {
          ...parseSessionNodeData(node, currentBlock),
          state: NODE_STATE.RUNNING,
        }
      : {};
  } catch (error) {
    console.error('Error fetching service nodes:', error);
  }
}
