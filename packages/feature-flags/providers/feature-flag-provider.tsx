'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, type ReactNode, useContext, useState } from 'react';
import type {
  FeatureFlags,
  GenericExperimentalFeatureFlag,
  GenericFeatureFlag,
} from '../lib/utils';

type FeatureFlagContext<Flag extends GenericFeatureFlag> = {
  featureFlags: FeatureFlags<Flag>;
  setFeatureFlags: (featureFlags: FeatureFlags<Flag>) => void;
};

const localStorageFeatureFlagKey = 'featureFlags';

function saveFeatureFlagsToStorage<Flag extends GenericFeatureFlag>(
  featureFlags: FeatureFlags<Flag>
) {
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

function bootstrapFeatureFlags<Flag extends GenericFeatureFlag>(validFeatureFlags?: Array<Flag>) {
  if (typeof window === 'undefined') {
    return {};
  }
  const featureFlags = loadFeatureFlagsFromStorage();
  const searchParams = useSearchParams();
  const searchParamEntries = searchParams.entries();

  if (validFeatureFlags?.length) {
    for (const [key, value] of searchParamEntries) {
      if (validFeatureFlags.includes(key as Flag)) {
        featureFlags[key as Flag] = value === 'true';
      }
    }
  }
  saveFeatureFlagsToStorage(featureFlags);

  return featureFlags;
}

const Context = createContext<FeatureFlagContext<GenericFeatureFlag> | undefined>(undefined);

export function FeatureFlagProviderGeneric<Flag extends GenericFeatureFlag>({
  children,
}: {
  children: ReactNode;
}) {
  const [featureFlags, setFeatureFlags] = useState(bootstrapFeatureFlags<Flag>());

  return <Context.Provider value={{ featureFlags, setFeatureFlags }}>{children}</Context.Provider>;
}

export const useFeatureFlagsGeneric = <Flag extends GenericFeatureFlag>(): FeatureFlags<Flag> => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useFeatureFlags must be used inside FeatureFlagProvider');
  }

  return context.featureFlags;
};

export const useFeatureFlagGeneric = <Flag extends GenericFeatureFlag>(flag: Flag) => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useFeatureFlag must be used inside FeatureFlagProvider');
  }

  return context.featureFlags[flag] ?? false;
};

export const useSetFeatureFlagGeneric = <Flag extends GenericFeatureFlag>() => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('setFeatureFlag must be used inside FeatureFlagProvider');
  }

  const setFeatureFlag = (flag: Flag, value: boolean) => {
    const newFeatureFlags = { ...context.featureFlags, [flag]: value };

    context.setFeatureFlags(newFeatureFlags);

    saveFeatureFlagsToStorage(newFeatureFlags);
  };

  return { setFeatureFlag };
};

export const useExperimentalFeatureFlagGeneric = <Flag extends GenericExperimentalFeatureFlag>(
  flag: Flag
) => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useExperimentalFeatureFlag must be used inside FeatureFlagProvider');
  }

  return context.featureFlags[flag] ?? false;
};

export const useSetExperimentalFeatureFlagGeneric = <
  Flag extends GenericExperimentalFeatureFlag,
>() => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useExperimentalFeatureFlag must be used inside FeatureFlagProvider');
  }

  const setFeatureFlag = (flag: Flag, value: boolean) => {
    const newFeatureFlags = { ...context.featureFlags, [flag]: value };

    context.setFeatureFlags(newFeatureFlags);

    saveFeatureFlagsToStorage(newFeatureFlags);
  };

  return { setFeatureFlag };
};
