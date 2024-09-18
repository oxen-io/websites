import { parseSessionNodeData } from '@/app/mystakes/modules/StakedNodesModule';
import { type Contributor, NODE_STATE, type ServiceNode } from '@session/sent-staking-js/client';
import { StakedNode } from '@/components/StakedNodeCard';

type ExplorerResponse<Result extends Record<string, unknown>> = {
  id: string;
  jsonrpc: string;
  result: Result;
  error?: { code: number; message: string };
};

type GetNodeResult = {
  block_hash: string;
  hardfork: number;
  height: number;
  service_node_states: Array<NodeState>;
  snode_revision: number;
  status: string;
  target_height: number;
};

type NodeState = {
  active: boolean;
  checkpoint_votes: {
    missed: Array<number>;
    voted: Array<number>;
  };
  contributors: Array<Contributor>;
  decommission_count: number;
  earned_downtime_blocks: number;
  funded: boolean;
  last_reward_block_height: number;
  last_reward_transaction_index: number;
  last_uptime_proof: number;
  lokinet_reachable: boolean;
  lokinet_version: [number, number, number];
  operator_address: string;
  operator_fee: number;
  portions_for_operator: number;
  pubkey_bls: string;
  pubkey_ed25519: string;
  pubkey_x25519: string;
  public_ip: string;
  pulse_votes: {
    missed: Array<[number, number]>;
    voted: Array<[number, number]>;
  };
  quorumnet_port: number;
  quorumnet_tests: Array<number>;
  registration_height: number;
  registration_hf_version: number;
  requested_unlock_height: number;
  service_node_pubkey: string;
  service_node_version: [number, number, number];
  staking_requirement: bigint;
  state_height: number;
  storage_lmq_port: number;
  storage_port: number;
  storage_server_reachable: true;
  storage_server_version: [number, number, number];
  swarm: string;
  swarm_id: number;
  timesync_tests: Array<number>;
  total_contributed: bigint;
};

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

    const res = (await response.json()) as ExplorerResponse<GetNodeResult>;

    if (res.error) {
      throw new Error(res.error.message);
    }

    const node = res.result.service_node_states[0] as ServiceNode | undefined;

    return node
      ? ({
          ...parseSessionNodeData(node, res.result.height),
          pubKey: node.service_node_pubkey,
          state: NODE_STATE.RUNNING,
        } satisfies StakedNode)
      : {};
  } catch (error) {
    console.error('Error fetching service nodes:', error);
    return {};
  }
}
