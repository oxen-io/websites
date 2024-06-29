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
 * @param userAddress The address of the user.
 * @returns An array of contributors.
 */
const generateContributors = (maxN = 10, userAddress?: string): Contributor[] => {
  const contributors = Array.from(
    { length: Math.ceil(Math.random() * (userAddress ? maxN - 1 : maxN)) },
    () => generateContributor()
  );
  if (userAddress) {
    contributors.unshift({
      address: userAddress,
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

type GenerateBasicNodeDataProps = {
  userAddress: string;
  operatorAddress?: string;
  minContributors?: number;
};

/**
 * Generates basic node data for a service node.
 * @param options The options for generating the node data.
 * @param options.userAddress - The user address for the node.
 * @param options.operatorAddress - The operator address for the node.
 * @returns The generated node data.
 */
function generateBasicNodeData({
  userAddress,
  operatorAddress,
  minContributors,
}: GenerateBasicNodeDataProps): Omit<ServiceNode, 'state'> {
  const num_contributions = Math.max(minContributors ?? 0, Math.ceil(Math.random() * 10));
  return {
    service_node_pubkey: generateNodePubKey(),
    requested_unlock_height: 0,
    active: true,
    funded: true,
    earned_downtime_blocks: 0,
    service_node_version: [1, 1, 1],
    contributors: generateContributors(num_contributions, userAddress),
    total_contributed: 0,
    total_reserved: 0,
    staking_requirement: 0,
    portions_for_operator: 0,
    operator_address: operatorAddress ?? generateWalletAddress(),
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
 * @param options.userAddress The user address for the service node.
 * @param options.operatorAddress The operator address for the service node.
 * @returns The generated service node object.
 */
const generateAwaitingContributorsNode = ({
  userAddress,
  operatorAddress,
}: GenerateBasicNodeDataProps): ServiceNode => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.AWAITING_CONTRIBUTORS,
    active: false,
    funded: false,
  };
};

/**
 * Generates a running service node.
 *
 * @param options The options for generating the running node.
 * @param options.userAddress The user address of the node.
 * @param options.operatorAddress The operator address of the node.
 * @param options.beingUnlocked Indicates if the node is being unlocked.
 * @returns The generated running service node.
 */
const generateRunningNode = ({
  userAddress,
  operatorAddress,
  beingUnlocked,
}: GenerateBasicNodeDataProps & {
  beingUnlocked?: boolean;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.RUNNING,
    active: true,
    ...(beingUnlocked ? { requested_unlock_height: generateFutureBlockHeight() } : {}),
  };
};

/**
 * Generates a cancelled service node object.
 *
 * @param options The options for generating the cancelled node.
 * @param options.userAddress The user address of the node.
 * @param options.operatorAddress The operator address of the node.
 * @returns The generated cancelled service node.
 */
const generateCancelledNode = ({
  userAddress,
  operatorAddress,
}: GenerateBasicNodeDataProps): ServiceNode => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.CANCELLED,
    active: false,
    funded: false,
  };
};

/**
 * Generates a deregistered service node object.
 *
 * @param options The options for generating the deregistered node.
 * @param options.userAddress The user address of the node.
 * @param options.awaitingLiquidation Indicates if the node is awaiting liquidation.
 * @returns The generated deregistered service node object.
 */
const generateDeregisteredNode = ({
  userAddress,
  operatorAddress,
  awaitingLiquidation,
}: GenerateBasicNodeDataProps & {
  awaitingLiquidation?: boolean;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.DEREGISTERED,
    active: false,
    funded: false,
    awaiting_liquidation: awaitingLiquidation,
  };
};

/**
 * Generates a decommissioned service node.
 * @param options The options for generating the decommissioned node.
 * @param options.userAddress The user address of the node.
 * @param options.operatorAddress The operator address of the node.
 * @param options.beingUnlocked Indicates if the node is being unlocked.
 * @returns The decommissioned service node.
 */
const generateDecommissionedNode = ({
  userAddress,
  operatorAddress,
  beingUnlocked,
}: GenerateBasicNodeDataProps & {
  beingUnlocked?: boolean;
}): ServiceNode => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.DECOMMISSIONED,
    decomm_blocks_remaining: generateFutureBlockHeight(),
    active: false,
    funded: false,
    ...(beingUnlocked ? { requested_unlock_height: generateFutureBlockHeight() } : {}),
  };
};

/**
 * Generates an unlocked node.
 *
 * @param options The options for generating the node.
 * @param options.userAddress The user address.
 * @returns The generated unlocked node.
 */
const generateUnlockedNode = ({
  userAddress,
  operatorAddress,
}: GenerateBasicNodeDataProps): ServiceNode => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.UNLOCKED,
    active: false,
    funded: false,
  };
};

/**
 * Generates mock node data for testing purposes.
 * @param params The parameters for generating mock node data.
 * @param params.userAddress The user address for the mock node data.
 * @returns The generated mock node data.
 */
export const generateMockNodeData = ({
  userAddress,
}: {
  userAddress: string;
}): GetNodesForWalletResponse => {
  const mockNodeData: GetNodesForWalletResponse = {
    nodes: [],
  };

  const operatorAddress = userAddress;

  mockNodeData.nodes.push(generateRunningNode({ userAddress }));
  mockNodeData.nodes.push(generateRunningNode({ userAddress, operatorAddress }));
  mockNodeData.nodes.push(generateRunningNode({ userAddress }));
  mockNodeData.nodes.push(generateRunningNode({ userAddress, beingUnlocked: true }));
  mockNodeData.nodes.push(
    generateRunningNode({ userAddress, beingUnlocked: true, operatorAddress })
  );
  mockNodeData.nodes.push(generateAwaitingContributorsNode({ userAddress, minContributors: 1 }));
  mockNodeData.nodes.push(generateAwaitingContributorsNode({ userAddress, minContributors: 10 }));
  mockNodeData.nodes.push(
    generateAwaitingContributorsNode({ userAddress, minContributors: 1, operatorAddress })
  );
  mockNodeData.nodes.push(generateCancelledNode({ userAddress }));
  mockNodeData.nodes.push(generateCancelledNode({ userAddress }));
  mockNodeData.nodes.push(generateCancelledNode({ userAddress, operatorAddress }));
  mockNodeData.nodes.push(generateDecommissionedNode({ userAddress }));
  mockNodeData.nodes.push(generateDecommissionedNode({ userAddress, beingUnlocked: true }));
  mockNodeData.nodes.push(generateDecommissionedNode({ userAddress, operatorAddress }));
  mockNodeData.nodes.push(
    generateDecommissionedNode({ userAddress, operatorAddress, beingUnlocked: true })
  );
  mockNodeData.nodes.push(generateDeregisteredNode({ userAddress }));
  mockNodeData.nodes.push(generateDeregisteredNode({ userAddress, awaitingLiquidation: true }));
  mockNodeData.nodes.push(generateDeregisteredNode({ userAddress, operatorAddress }));
  mockNodeData.nodes.push(generateDeregisteredNode({ userAddress, operatorAddress }));
  mockNodeData.nodes.push(generateUnlockedNode({ userAddress }));
  mockNodeData.nodes.push(generateUnlockedNode({ userAddress, operatorAddress }));
  mockNodeData.nodes.push(generateUnlockedNode({ userAddress, operatorAddress }));

  return mockNodeData;
};
