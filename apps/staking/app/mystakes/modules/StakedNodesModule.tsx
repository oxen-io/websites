'use client';

import Loading from '@/app/loading';
import { GenericStakedNode, StakedNode, StakedNodeCard } from '@/components/StakedNodeCard';
import { WalletModalButtonWithLocales } from '@/components/WalletModalButtonWithLocales';
import { internalLink } from '@/lib/locale-defaults';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import type { ServiceNode } from '@session/sent-staking-js/client';
import { generateMockNodeData } from '@session/sent-staking-js/test';
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
import {
  getDateFromUnixTimestampSeconds,
  getUnixTimestampNowSeconds,
  timeBetweenEvents,
} from '@session/util/date';
import { SESSION_NODE } from '@/lib/constants';
import { EXPERIMENTAL_FEATURE_FLAG, FEATURE_FLAG } from '@/lib/feature-flags';
import { useExperimentalFeatureFlag, useFeatureFlag } from '@/lib/feature-flags-client';

function StakedNodesWithAddress({ address }: { address: string }) {
  const showMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_STAKED_NODES);
  const showNoNodes = useFeatureFlag(FEATURE_FLAG.MOCK_NO_STAKED_NODES);

  if (showMockNodes && showNoNodes) {
    console.error('Cannot show mock nodes and no nodes at the same time');
  }

  const { data, isLoading } = useStakingBackendQueryWithParams(getStakedNodes, {
    address,
  });

  const nodes = useMemo(() => {
    if (showMockNodes) {
      return generateMockNodeData({ userAddress: address }).nodes;
    } else if (showNoNodes) {
      return [];
    }
    return data?.nodes ?? [];
  }, [data, showMockNodes, showNoNodes]);

  return (
    <ModuleGridContent className="h-full md:overflow-y-auto">
      {isLoading ? (
        <Loading />
      ) : nodes.length ? (
        nodes.map((node) => (
          <StakedNodeCard
            key={node.service_node_pubkey}
            node={
              parseSessionNodeData(
                node,
                data?.network?.block_height,
                data?.network?.block_timestamp
              ) as StakedNode
            }
          />
        ))
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

export const parseSessionNodeData = (
  node: ServiceNode,
  currentBlock: number = 0,
  networkTime: number = getUnixTimestampNowSeconds()
): GenericStakedNode => {
  return {
    state: node.state,
    contributors: node.contributors,
    lastRewardHeight: 0,
    lastUptime: getDateFromUnixTimestampSeconds(node.last_uptime_proof),
    pubKey: node.service_node_pubkey,
    balance: node.total_contributed,
    operatorFee: node.operator_fee,
    operator_address: node.operator_address,
    ...(node.awaiting_liquidation ? { awaitingLiquidation: true } : {}),
    ...(node.decomm_blocks_remaining
      ? {
          deregistrationDate: new Date(
            networkTime * 1000 + node.decomm_blocks_remaining * SESSION_NODE.MS_PER_BLOCK
          ),
        }
      : {}),
    ...(node.requested_unlock_height
      ? {
          unlockDate: new Date(
            networkTime * 1000 +
              timeBetweenEvents(
                node.requested_unlock_height,
                currentBlock,
                SESSION_NODE.BLOCK_VELOCITY
              )
          ),
        }
      : {}),
  };
};
