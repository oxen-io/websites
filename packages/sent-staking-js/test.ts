import { GetStakesResponse, NODE_STATE, type Registration, Stake, StakeContributor } from './client';

// NOTE: this file will be refactored at some point, it doesnt work very well

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
const generateWalletAddress = generateNodePubKey;

/**
 * Generates a contributor object.
 * @returns The generated contributor object.
 */
const generateContributor = (address?: string): StakeContributor => {
  return {
    address: address ?? generateWalletAddress(),
    amount: Math.round(Math.random() * 1000),
    reserved: Math.round(Math.random() * 1000),
  };
};

/**
 * Generates an array of contributors.
 *
 * @param maxN The maximum number of contributors to generate.
 * @param userAddress The address of the user.
 * @returns An array of contributors.
 */
const generateContributors = (maxN = 10, userAddress?: string): StakeContributor[] => {
  const contributors = Array.from(
    { length: Math.ceil(Math.random() * (userAddress ? maxN - 1 : maxN)) },
    () => generateContributor()
  );

  contributors.unshift(generateContributor(userAddress));
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
  operatorAddress = generateWalletAddress(),
  minContributors,
}: GenerateBasicNodeDataProps): Omit<Stake, 'state'> {
  const num_contributions = Math.max(minContributors ?? 0, Math.ceil(Math.random() * 10));
  const contributors = generateContributors(num_contributions, userAddress);
  const staked_balance = contributors.find(({ address }) => address === userAddress)?.amount ?? 0;
  return {
    service_node_pubkey: generateNodePubKey(),
    requested_unlock_height: 0,
    last_reward_block_height: 0,
    contract_id: 0,
    contributors: generateContributors(num_contributions, userAddress),
    operator_address: operatorAddress,
    last_uptime_proof: generatePastBlockHeight(),
    operator_fee: 0,
    exited: false,
    earned_downtime_blocks: 20,
    deregistration_unlock_height: null,
    liquidation_height: null,
    staked_balance: staked_balance,
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
}: GenerateBasicNodeDataProps): Stake => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.AWAITING_CONTRIBUTORS,
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
}): Stake => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.RUNNING,
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
}: GenerateBasicNodeDataProps): Stake => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.CANCELLED,
  };
};

/**
 * Generates a deregistered service node object.
 *
 * @param options The options for generating the deregistered node.
 * @param options.userAddress The user address of the node.
 * @returns The generated deregistered service node object.
 */
const generateDeregisteredNode = ({
  userAddress,
  operatorAddress,
}: GenerateBasicNodeDataProps): Stake => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.DEREGISTERED,
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
}): Stake => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.DECOMMISSIONED,
    earned_downtime_blocks: 20,
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
}: GenerateBasicNodeDataProps): Stake => {
  return {
    ...generateBasicNodeData({ userAddress, operatorAddress }),
    state: NODE_STATE.EXITED,
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
}): GetStakesResponse => {
  const mockNodeData: GetStakesResponse = {
    stakes: [],
    historical_stakes: [],
    error_stakes: [],
    network: {
      block_height: 1000,
      block_timestamp: Date.now(),
    } as never,
    wallet: {
      rewards: BigInt('480000000000'),
      contract_rewards: BigInt('240000000000'),
      contract_claimed: BigInt('240000000000'),
    },
  };

  const operatorAddress = userAddress;

  mockNodeData.stakes.push(generateRunningNode({ userAddress }));
  mockNodeData.stakes.push(generateRunningNode({ userAddress, operatorAddress }));
  mockNodeData.stakes.push(generateRunningNode({ userAddress }));
  mockNodeData.stakes.push(generateRunningNode({ userAddress, beingUnlocked: true }));
  mockNodeData.stakes.push(
    generateRunningNode({ userAddress, beingUnlocked: true, operatorAddress })
  );
  mockNodeData.stakes.push(generateAwaitingContributorsNode({ userAddress, minContributors: 1 }));
  mockNodeData.stakes.push(generateAwaitingContributorsNode({ userAddress, minContributors: 10 }));
  mockNodeData.stakes.push(
    generateAwaitingContributorsNode({ userAddress, minContributors: 1, operatorAddress })
  );
  mockNodeData.stakes.push(generateCancelledNode({ userAddress }));
  mockNodeData.stakes.push(generateCancelledNode({ userAddress }));
  mockNodeData.stakes.push(generateCancelledNode({ userAddress, operatorAddress }));
  mockNodeData.stakes.push(generateDecommissionedNode({ userAddress }));
  mockNodeData.stakes.push(generateDecommissionedNode({ userAddress, beingUnlocked: true }));
  mockNodeData.stakes.push(generateDecommissionedNode({ userAddress, operatorAddress }));
  mockNodeData.stakes.push(
    generateDecommissionedNode({ userAddress, operatorAddress, beingUnlocked: true })
  );
  mockNodeData.stakes.push(generateDeregisteredNode({ userAddress }));
  mockNodeData.stakes.push(generateDeregisteredNode({ userAddress, operatorAddress }));
  mockNodeData.stakes.push(generateDeregisteredNode({ userAddress, operatorAddress }));
  mockNodeData.stakes.push(generateUnlockedNode({ userAddress }));
  mockNodeData.stakes.push(generateUnlockedNode({ userAddress, operatorAddress }));
  mockNodeData.stakes.push(generateUnlockedNode({ userAddress, operatorAddress }));

  return mockNodeData;
};

export const generateNodeRegistration = ({
  userAddress,
  type,
}: {
  userAddress: string;
  type: Registration['type'];
}): Registration => {
  return {
    contract: generateNodePubKey(),
    pubkey_ed25519: generateNodePubKey(),
    pubkey_bls: generateNodePubKey(),
    sig_bls: generateNodePubKey(),
    sig_ed25519: generateNodePubKey(),
    // Generates a random time in the near past
    timestamp: (Date.now() - Math.random() * Math.pow(Math.random() * 10, 10)) / 1000,
    type,
    operator: userAddress,
  };
};

export const generateMockRegistrations = ({
  userAddress,
  numberOfNodes,
}: {
  userAddress: string;
  numberOfNodes: number;
}): Array<Registration> => {
  return Array.from({
    length: numberOfNodes,
  }).map(() => generateNodeRegistration({ userAddress, type: 'solo' }));
};
