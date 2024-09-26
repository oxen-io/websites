export enum EXPERIMENTAL_FEATURE_FLAG {
  HIDE_REGISTRATIONS = 'experimental_hideRegistrations',
  HIDE_STAKED_NODES = 'experimental_hideStakedNodes',
  WALLET_SHEET = 'experimental_walletSheet',
}

export enum REMOTE_FEATURE_FLAG {
  CUSTOM_BANNER = 'remote_customBanner',
  NEW_TOKEN_CONTRACT = 'remote_newTokenContract',
  DISABLE_NODE_REGISTRATION = 'remote_disableNodeRegistration',
  DISABLE_CLAIM_REWARDS = 'remote_disableClaimRewards',
  DISABLE_REQUEST_NODE_EXIT = 'remote_disableRequestNodeExit',
  DISABLE_NODE_EXIT = 'remote_disableNodeExit',
}

export const remoteFeatureFlagsInfo: Record<
  REMOTE_FEATURE_FLAG,
  { name: string; description: string }
> = {
  [REMOTE_FEATURE_FLAG.DISABLE_NODE_REGISTRATION]: {
    name: 'Disable Node Registration',
    description: 'Disable the ability to register a node.',
  },
  [REMOTE_FEATURE_FLAG.DISABLE_CLAIM_REWARDS]: {
    name: 'Disable Claim Rewards',
    description: 'Disable the ability to claim rewards.',
  },
  [REMOTE_FEATURE_FLAG.DISABLE_REQUEST_NODE_EXIT]: {
    name: 'Disable Node Exit Request',
    description: 'Disable the ability to request a nodes exit.',
  },
  [REMOTE_FEATURE_FLAG.DISABLE_NODE_EXIT]: {
    name: 'Disable Node Exit',
    description: 'Disable the ability to exit a node from the network.',
  },
  [REMOTE_FEATURE_FLAG.CUSTOM_BANNER]: {
    name: 'Custom Banner',
    description: 'Use a custom with custom text.',
  },
  [REMOTE_FEATURE_FLAG.NEW_TOKEN_CONTRACT]: {
    name: 'New Token Contract',
    description: 'The token contract address been updated.',
  },
};

export const experimentalFeatureFlags = Object.values(
  EXPERIMENTAL_FEATURE_FLAG
) as Array<EXPERIMENTAL_FEATURE_FLAG>;

export const experimentalFeatureFlagsInfo: Record<
  EXPERIMENTAL_FEATURE_FLAG,
  {
    name: string;
    description: string;
  }
> = {
  [EXPERIMENTAL_FEATURE_FLAG.HIDE_REGISTRATIONS]: {
    name: 'Hide Registrations',
    description:
      'Hide selected prepared registrations from the Pending Session Nodes list. The list of hidden registrations can be found in the settings tab.',
  },
  [EXPERIMENTAL_FEATURE_FLAG.HIDE_STAKED_NODES]: {
    name: 'Hide Staked Nodes',
    description:
      'Hide selected staked nodes from the Staked Nodes list on the My Stakes page. The visibility of these hidden nodes can be toggled on the page.',
  },
  [EXPERIMENTAL_FEATURE_FLAG.WALLET_SHEET]: {
    name: 'Wallet Sheet',
    description:
      "Use the new Wallet Sheet. This is a replacement for the wallet info modal and shows up when the wallet button is clicked. It's the new home of settings, network switching, and token management.",
  },
};

export enum FEATURE_FLAG {
  MOCK_STAKED_NODES = 'mockStakedNodes',
  MOCK_NO_STAKED_NODES = 'mockNoStakedNodes',
  MOCK_OPEN_NODES = 'mockOpenNodes',
  MOCK_NO_OPEN_NODES = 'mockNoOpenNodes',
  MOCK_PENDING_NODES_ONE = 'mockPendingNodesOne',
  MOCK_PENDING_NODES_TWO = 'mockPendingNodesTwo',
  MOCK_PENDING_NODES_THREE = 'mockPendingNodesThree',
  MOCK_PENDING_NODES_MANY = 'mockPendingNodesMany',
  MOCK_NO_PENDING_NODES = 'mockNoPendingNodes',
  MOCK_REGISTRATION = 'mockRegistration',
  CLEAR_ACCEPT_BUG_BOUNTY = 'clearAcceptTOS',
  CLEAR_ACCEPT_EXPERIMENTAL = 'clearAcceptExperimental',
  SHOW_ALL_TIMERS = 'showAllTimers',
  SHOW_NODE_RAW_DATA = 'showNodeRawData',
}

export const FEATURE_FLAG_DESCRIPTION = {
  [FEATURE_FLAG.MOCK_STAKED_NODES]: 'Replace staked nodes with mock data',
  [FEATURE_FLAG.MOCK_NO_STAKED_NODES]: 'Replace staked nodes with no data',
  [FEATURE_FLAG.MOCK_OPEN_NODES]: 'Replace open nodes with mock data',
  [FEATURE_FLAG.MOCK_NO_OPEN_NODES]: 'Replace open nodes with no data',
  [FEATURE_FLAG.MOCK_PENDING_NODES_ONE]: 'Replace pending nodes with 1 node with mock data',
  [FEATURE_FLAG.MOCK_PENDING_NODES_TWO]: 'Replace pending nodes with 2 node with mock data',
  [FEATURE_FLAG.MOCK_PENDING_NODES_THREE]: 'Replace pending nodes with 3 node with mock data',
  [FEATURE_FLAG.MOCK_PENDING_NODES_MANY]: 'Replace pending nodes with many node with mock data',
  [FEATURE_FLAG.MOCK_NO_PENDING_NODES]: 'Replace pending nodes with no data',
  [FEATURE_FLAG.MOCK_REGISTRATION]: 'Use a mock node for the registration form',
  [FEATURE_FLAG.CLEAR_ACCEPT_BUG_BOUNTY]: 'Clear the accepted bug bounty conditions',
  [FEATURE_FLAG.CLEAR_ACCEPT_EXPERIMENTAL]: 'Clear the accepted experimental features conditions',
  [FEATURE_FLAG.SHOW_ALL_TIMERS]: 'Show all staked node timers',
  [FEATURE_FLAG.SHOW_NODE_RAW_DATA]: 'Show raw data for staked nodes',
};

export const validFeatureFlags = Object.values(FEATURE_FLAG);

export const pageFeatureFlags: Record<string, Array<FEATURE_FLAG>> = {
  mystakes: [
    FEATURE_FLAG.MOCK_STAKED_NODES,
    FEATURE_FLAG.MOCK_NO_STAKED_NODES,
    FEATURE_FLAG.SHOW_ALL_TIMERS,
    FEATURE_FLAG.SHOW_NODE_RAW_DATA,
  ],
  address: [
    FEATURE_FLAG.MOCK_STAKED_NODES,
    FEATURE_FLAG.MOCK_NO_STAKED_NODES,
    FEATURE_FLAG.SHOW_ALL_TIMERS,
    FEATURE_FLAG.SHOW_NODE_RAW_DATA,
  ],
  stake: [
    FEATURE_FLAG.MOCK_OPEN_NODES,
    FEATURE_FLAG.MOCK_NO_OPEN_NODES,
    FEATURE_FLAG.MOCK_PENDING_NODES_ONE,
    FEATURE_FLAG.MOCK_PENDING_NODES_TWO,
    FEATURE_FLAG.MOCK_PENDING_NODES_THREE,
    FEATURE_FLAG.MOCK_PENDING_NODES_MANY,
    FEATURE_FLAG.MOCK_NO_PENDING_NODES,
  ],
  register: [FEATURE_FLAG.MOCK_REGISTRATION],
};

export const globalFeatureFlags = [
  FEATURE_FLAG.CLEAR_ACCEPT_BUG_BOUNTY,
  FEATURE_FLAG.CLEAR_ACCEPT_EXPERIMENTAL,
];

export type FeatureFlags = Record<FEATURE_FLAG | EXPERIMENTAL_FEATURE_FLAG, boolean>;
