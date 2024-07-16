'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useState } from 'react';

type FeatureFlags = Record<FEATURE_FLAG, boolean>;

type FeatureFlagContext = {
  featureFlags: FeatureFlags;
  setFeatureFlags: (featureFlags: FeatureFlags) => void;
};

const localStorageFeatureFlagKey = 'featureFlags';

function saveFeatureFlagsToStorage(featureFlags: FeatureFlags) {
  localStorage.setItem(localStorageFeatureFlagKey, JSON.stringify(featureFlags));

  // @ts-expect-error - Expose feature flags to window for debugging
  window.featureFlags = featureFlags;
}

function loadFeatureFlagsFromStorage() {
  const storedFeatureFlags = localStorage.getItem(localStorageFeatureFlagKey);

  if (!storedFeatureFlags) {
    return {};
  }

  return JSON.parse(storedFeatureFlags);
}

function bootstrapFeatureFlags() {
  if (typeof window === 'undefined') {
    return {};
  }
  const featureFlags = loadFeatureFlagsFromStorage();
  const searchParams = useSearchParams();

  const searchParamEntries = searchParams.entries();

  for (const [key, value] of searchParamEntries) {
    if (validFeatureFlags.includes(key as FEATURE_FLAG)) {
      featureFlags[key as FEATURE_FLAG] = value === 'true';
    }
  }

  saveFeatureFlagsToStorage(featureFlags);

  return featureFlags;
}

const Context = createContext<FeatureFlagContext | undefined>(undefined);

export default function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const [featureFlags, setFeatureFlags] = useState(bootstrapFeatureFlags());

  return <Context.Provider value={{ featureFlags, setFeatureFlags }}>{children}</Context.Provider>;
}

export const useFeatureFlags = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useFeatureFlags must be used inside FeatureFlagProvider');
  }

  return context.featureFlags;
};

export const useFeatureFlag = (flag: FEATURE_FLAG) => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useFeatureFlag must be used inside FeatureFlagProvider');
  }

  return context.featureFlags[flag] ?? false;
};

export const useSetFeatureFlag = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('setFeatureFlag must be used inside FeatureFlagProvider');
  }

  const setFeatureFlag = (flag: FEATURE_FLAG, value: boolean) => {
    const newFeatureFlags = { ...context.featureFlags, [flag]: value };

    context.setFeatureFlags(newFeatureFlags);

    saveFeatureFlagsToStorage(newFeatureFlags);
  };

  return { setFeatureFlag };
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
};

export const validFeatureFlags = Object.values(FEATURE_FLAG);

export const pageFeatureFlags: Record<string, Array<FEATURE_FLAG>> = {
  mystakes: [FEATURE_FLAG.MOCK_STAKED_NODES, FEATURE_FLAG.MOCK_NO_STAKED_NODES],
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
