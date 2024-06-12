import {
  NODE_STATE,
  type Contributor,
  type GetNodesForWalletResponse,
  type ServiceNode,
} from './client';

/**
 * Generates a random mock node public key.
 * @returns The generated node public key.
 */
const generateNodePubKey = (): string =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

/**
 * Generates a random mock wallet address.
 * @returns The generated wallet address.
 */
const generateWalletAddress = (): string =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

/**
 * Generates a contributor object.
 * @returns The generated contributor object.
 */
const generateContributor = (): Contributor => {
  return {
    address: generateWalletAddress(),
    amount: Math.random() * 1000,
    reserved: Math.random() * 1000,
    locked_contributions: [],
  };
};

/**
 * Generates an array of contributors.
 *
 * @param maxN The maximum number of contributors to generate.
 * @param operatorAddress The address of the operator.
 * @returns An array of contributors.
 */
const generateContributors = (maxN = 10, operatorAddress?: string): Contributor[] => {
  const contributors = Array.from(
    { length: Math.ceil(Math.random() * (operatorAddress ? maxN - 1 : maxN)) },
    () => generateContributor()
  );
  if (operatorAddress) {
    contributors.unshift({
      address: operatorAddress,
      amount: Math.random() * 1000,
      reserved: Math.random() * 1000,
      locked_contributions: [],
    });
  }
  return contributors;
};

// TODO - Adjust this to be dynamic based on the current block height and change the past and future block height generation functions to be more accurate.
const currentBlockHeight = 1000;

/**
 * Generates a past block height based on the current block height and a maximum distance.
 * @param maxDistance - The maximum distance from the current block height.
 * @returns The generated past block height.
 */
const generatePastBlockHeight = (maxDistance = 100): number => {
  return currentBlockHeight - Math.floor(Math.random() * maxDistance);
};

/**
 * Generates a future block height based on the current block height and a maximum distance.
 * @param maxDistance - The maximum distance from the current block height.
 * @returns The generated future block height.
 */
const generateFutureBlockHeight = (maxDistance = 100): number => {
  return currentBlockHeight + Math.floor(Math.random() * maxDistance);
};

/**
 * Generates basic node data for a service node.
 * @param options The options for generating the node data.
 * @param options.operatorAddress - The operator address for the node.
 * @returns The generated node data.
 */
function generateBasicNodeData({
  operatorAddress,
}: {
  operatorAddress?: string;
}): Omit<ServiceNode, 'state'> {
  const num_contributions = Math.floor(Math.random() * 10);
  return {
    service_node_pubkey: generateNodePubKey(),
    requested_unlock_height: 0,
    active: true,
    funded: true,
    earned_downtime_blocks: 0,
    service_node_version: [1, 1, 1],
    contributors: generateContributors(num_contributions, operatorAddress),
    total_contributed: 0,
    total_reserved: 0,
    staking_requirement: 0,
    portions_for_operator: 0,
    operator_address: generateWalletAddress(),
    pubkey_ed25519: '...',
    last_uptime_proof: generatePastBlockHeight(),
    state_height: 0,
    swarm_id: 0,
    contribution_open: 0,
    contribution_required: 0,
    num_contributions,
  };
}

/**
 * Generates a service node object in the "AWAITING_CONTRIBUTORS" state.
 * @param options The options for generating the service node.
 * @param options.operatorAddress The operator address for the service node.
 * @returns The generated service node object.
 */
const generateAwaitingContributorsNode = ({
  operatorAddress,
}: {
  operatorAddress?: string;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ operatorAddress }),
    state: NODE_STATE.AWAITING_CONTRIBUTORS,
    active: false,
    funded: false,
  };
};

/**
 * Generates a running service node.
 *
 * @param options The options for generating the running node.
 * @param options.operatorAddress The operator address of the node.
 * @param options.beingDeregistered Indicates if the node is being deregistered.
 * @returns The generated running service node.
 */
const generateRunningNode = ({
  operatorAddress,
  beingDeregistered,
}: {
  operatorAddress?: string;
  beingDeregistered?: boolean;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ operatorAddress }),
    state: NODE_STATE.RUNNING,
    active: true,
    ...(beingDeregistered ? { requested_unlock_height: generateFutureBlockHeight() } : {}),
  };
};

/**
 * Generates a cancelled service node object.
 *
 * @param options The options for generating the cancelled node.
 * @param options.operatorAddress The operator address of the node.
 * @param options.canRestake Indicates if the node can restake.
 * @returns The generated cancelled service node.
 */
const generateCancelledNode = ({
  operatorAddress,
  canRestake,
}: {
  operatorAddress?: string;
  canRestake?: boolean;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ operatorAddress }),
    state: NODE_STATE.CANCELLED,
    active: false,
    funded: false,
    can_restake: canRestake,
  };
};

/**
 * Generates a deregistered service node object.
 *
 * @param options The options for generating the deregistered node.
 * @param options.operatorAddress The operator address of the node.
 * @param options.awaitingLiquidation Indicates if the node is awaiting liquidation.
 * @param options.canRestake Indicates if the node can be restaked.
 * @returns The generated deregistered service node object.
 */
const generateDeregistedNode = ({
  operatorAddress,
  awaitingLiquidation,
  canRestake,
}: {
  operatorAddress?: string;
  awaitingLiquidation?: boolean;
  canRestake?: boolean;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ operatorAddress }),
    state: NODE_STATE.DEREGISTERED,
    active: false,
    funded: false,
    awaiting_liquidation: awaitingLiquidation,
    can_restake: canRestake,
  };
};

/**
 * Generates a decommissioned service node.
 * @param options The options for generating the decommissioned node.
 * @param options.operatorAddress The operator address of the node.
 * @returns The decommissioned service node.
 */
const generateDecommissionedNode = ({
  operatorAddress,
}: {
  operatorAddress?: string;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ operatorAddress }),
    state: NODE_STATE.DECOMMISSIONED,
    active: false,
    funded: false,
    requested_unlock_height: generateFutureBlockHeight(),
  };
};

/**
 * Generates a voluntary deregistration node.
 *
 * @param options The options for generating the node.
 * @param options.operatorAddress The operator address.
 * @param options.canRestake Indicates if the node can restake.
 * @returns The generated voluntary deregistration node.
 */
const generateVoluntaryDeregistrationNode = ({
  operatorAddress,
  canRestake,
}: {
  operatorAddress?: string;
  canRestake?: boolean;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ operatorAddress }),
    state: NODE_STATE.UNLOCKED,
    active: false,
    funded: false,
    can_restake: canRestake,
  };
};

/**
 * Generates mock node data for testing purposes.
 * @param params The parameters for generating mock node data.
 * @param params.operatorAddress The operator address for the mock node data.
 * @returns The generated mock node data.
 */
export const generateMockNodeData = ({
  operatorAddress,
}: {
  operatorAddress: string;
}): GetNodesForWalletResponse => {
  const mockNodeData: GetNodesForWalletResponse = {
    nodes: [],
  };

  mockNodeData.nodes.push(generateRunningNode({ operatorAddress }));
  mockNodeData.nodes.push(generateRunningNode({}));
  mockNodeData.nodes.push(generateRunningNode({ operatorAddress, beingDeregistered: true }));
  mockNodeData.nodes.push(generateAwaitingContributorsNode({ operatorAddress }));
  mockNodeData.nodes.push(generateAwaitingContributorsNode({}));
  mockNodeData.nodes.push(generateCancelledNode({ operatorAddress, canRestake: true }));
  mockNodeData.nodes.push(generateCancelledNode({}));
  mockNodeData.nodes.push(generateCancelledNode({ operatorAddress }));
  mockNodeData.nodes.push(generateDecommissionedNode({}));
  mockNodeData.nodes.push(generateDecommissionedNode({ operatorAddress }));
  mockNodeData.nodes.push(generateDeregistedNode({}));
  mockNodeData.nodes.push(generateDeregistedNode({ awaitingLiquidation: true }));
  mockNodeData.nodes.push(generateDeregistedNode({ operatorAddress }));
  mockNodeData.nodes.push(generateDeregistedNode({ operatorAddress, canRestake: true }));
  mockNodeData.nodes.push(generateVoluntaryDeregistrationNode({ operatorAddress }));
  mockNodeData.nodes.push(generateVoluntaryDeregistrationNode({}));
  mockNodeData.nodes.push(
    generateVoluntaryDeregistrationNode({ operatorAddress, canRestake: true })
  );

  return mockNodeData;
};
