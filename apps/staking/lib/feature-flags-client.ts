'use client';

import { EXPERIMENTAL_FEATURE_FLAG, FEATURE_FLAG, REMOTE_FEATURE_FLAG } from '@/lib/feature-flags';
import {
  FeatureFlagProviderGeneric,
  useExperimentalFeatureFlagGeneric,
  useFeatureFlagGeneric,
  useFeatureFlagsGeneric,
  useSetExperimentalFeatureFlagGeneric,
  useSetFeatureFlagGeneric,
} from '@session/feature-flags/providers/feature-flag-provider';
import { useQuery } from '@tanstack/react-query';
import { getRemoteFeatureFlagsGeneric } from '@session/feature-flags/remote';
import { QUERY } from '@/lib/constants';
import { useMemo } from 'react';

export const useFeatureFlag = useFeatureFlagGeneric<FEATURE_FLAG>;
export const useSetFeatureFlag = useSetFeatureFlagGeneric<FEATURE_FLAG>;
export const useFeatureFlags = useFeatureFlagsGeneric<FEATURE_FLAG | EXPERIMENTAL_FEATURE_FLAG>;
export const useExperimentalFeatureFlag =
  useExperimentalFeatureFlagGeneric<EXPERIMENTAL_FEATURE_FLAG>;
export const useSetExperimentalFeatureFlag =
  useSetExperimentalFeatureFlagGeneric<EXPERIMENTAL_FEATURE_FLAG>;
export const FeatureFlagProvider = FeatureFlagProviderGeneric<FEATURE_FLAG>;

export const useRemoteFeatureFlagsQuery = () => {
  return useQuery<Set<REMOTE_FEATURE_FLAG>>({
    queryKey: ['remoteFeatureFlags'],
    staleTime: QUERY.STALE_TIME_REMOTE_FEATURE_FLAGS,
    queryFn: async () => {
      const { flags, error } = await getRemoteFeatureFlagsGeneric<REMOTE_FEATURE_FLAG>();

      if (error) {
        console.error(error);
      }

      return new Set(flags);
    },
  });
};

export const useRemoteFeatureFlagQuery = (flag: REMOTE_FEATURE_FLAG) => {
  const { data: flags, isLoading } = useRemoteFeatureFlagsQuery();

  const enabled = useMemo(() => flags && flags.has(flag), [flags]);

  return { enabled, isLoading };
};
