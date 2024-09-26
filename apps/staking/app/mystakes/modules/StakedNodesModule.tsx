'use client';

import Loading from '@/app/loading';
import { generateStakeId, StakedNodeCard } from '@/components/StakedNodeCard';
import { WalletModalButtonWithLocales } from '@/components/WalletModalButtonWithLocales';
import { internalLink } from '@/lib/locale-defaults';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import {
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridInfoContent,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { Button } from '@session/ui/ui/button';
import { Switch } from '@session/ui/ui/switch';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { getStakedNodes } from '@/lib/queries/getStakedNodes';
import { EXPERIMENTAL_FEATURE_FLAG, FEATURE_FLAG } from '@/lib/feature-flags';
import { useExperimentalFeatureFlag, useFeatureFlag } from '@/lib/feature-flags-client';
import { Address } from 'viem';
import { generateMockNodeData } from '@session/sent-staking-js/test';

export function StakedNodesWithAddress({ address }: { address: Address }) {
  const showMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_STAKED_NODES);
  const showNoNodes = useFeatureFlag(FEATURE_FLAG.MOCK_NO_STAKED_NODES);

  if (showMockNodes && showNoNodes) {
    console.error('Cannot show mock nodes and no nodes at the same time');
  }

  const { data, isLoading } = useStakingBackendQueryWithParams(getStakedNodes, {
    address,
  });

  const [stakes, blockHeight, networkTime] = useMemo(() => {
    if (showMockNodes) {
      const mockResponse = generateMockNodeData({ userAddress: address });
      return [
        mockResponse.stakes,
        mockResponse.network.block_height,
        mockResponse.network.block_timestamp,
      ];
    } else if (!data || showNoNodes) {
      return [[], null, null];
    }
    
    return [
      data.stakes.concat(data.historical_stakes),
      data.network.block_height,
      data.network.block_timestamp,
    ];
  }, [data, showMockNodes, showNoNodes]);

  return (
    <ModuleGridContent className="h-full md:overflow-y-auto">
      {isLoading ? (
        <Loading />
      ) : stakes?.length && blockHeight && networkTime ? (
        stakes.map((node) => {
          const key = generateStakeId(node);
          return (
            <StakedNodeCard
              key={key}
              uniqueId={key}
              node={node}
              blockHeight={blockHeight}
              networkTime={networkTime}
              targetWalletAddress={address}
            />
          );
        })
      ) : (
        <NoNodes />
      )}
    </ModuleGridContent>
  );
}

export default function StakedNodesModule() {
  const hideStakedNodesFlagEnabled = useExperimentalFeatureFlag(
    EXPERIMENTAL_FEATURE_FLAG.HIDE_STAKED_NODES
  );
  const dictionary = useTranslations('modules.stakedNodes');
  const { address } = useWallet();

  return (
    <>
      <ModuleGridHeader>
        <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
        <div className="flex flex-row gap-2 align-middle">
          {hideStakedNodesFlagEnabled ? (
            <>
              <span className="hidden sm:block">{dictionary('showHiddenText')}</span>
              <Switch />
            </>
          ) : null}
        </div>
      </ModuleGridHeader>
      {address ? <StakedNodesWithAddress address={address} /> : <NoWallet />}
    </>
  );
}

function NoWallet() {
  const dictionary = useTranslations('modules.stakedNodes');
  return (
    <ModuleGridInfoContent>
      <p>{dictionary('noWalletP1')}</p>
      <p>{dictionary('noWalletP2')}</p>
      <WalletModalButtonWithLocales rounded="md" size="lg" />
    </ModuleGridInfoContent>
  );
}

function NoNodes() {
  const dictionary = useTranslations('modules.stakedNodes');
  return (
    <ModuleGridInfoContent>
      <p>{dictionary('noNodesP1')}</p>
      <p>{dictionary.rich('noNodesP2', { link: internalLink('/stake') })}</p>
      <Link href="/stake" prefetch>
        <Button
          aria-label={dictionary('stakeNowButtonAria')}
          data-testid={ButtonDataTestId.My_Stakes_Stake_Now}
          rounded="md"
          size="lg"
        >
          {dictionary('stakeNowButtonText')}
        </Button>
      </Link>
    </ModuleGridInfoContent>
  );
}
