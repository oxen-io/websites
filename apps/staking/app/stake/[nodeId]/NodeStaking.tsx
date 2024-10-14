'use client';

import { PubKey } from '@session/ui/components/PubKey';
import { formatPercentage } from '@/lib/locale-client';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { SENT_DECIMALS, SENT_SYMBOL } from '@session/contracts';
import type { GetOpenNodesResponse } from '@session/sent-staking-js/client';
import { Loading } from '@session/ui/components/loading';
import { Button, ButtonSkeleton } from '@session/ui/ui/button';
import { bigIntToNumber, formatNumber } from '@session/util-crypto/maths';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ActionModuleRow, ActionModuleRowSkeleton } from '@/components/ActionModule';
import { useStakingBackendSuspenseQuery } from '@/lib/sent-staking-backend-client';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import { areHexesEqual } from '@session/util-crypto/string';

export default function NodeStaking({ nodeId }: { nodeId: string }) {
  const { data, isLoading } = useStakingBackendSuspenseQuery(getOpenNodes);

  const node = useMemo(() => {
    return data?.nodes?.find((node) => areHexesEqual(node.service_node_pubkey, nodeId));
  }, [data]);

  return isLoading ? (
    <Loading />
  ) : node ? (
    <NodeStakingForm node={node} />
  ) : (
    <span>Node not found</span>
  );
}

export function NodeStakingForm({ node }: { node: GetOpenNodesResponse['nodes'][number] }) {
  // const dictionary = useTranslations('actionModules.node');
  const generalDictionary = useTranslations('general');
  const sessionNodeDictionary = useTranslations('sessionNodes.general');
  const sessionNodeStakingDictionary = useTranslations('sessionNodes.staking');

  const formattedTotalStakedAmount = useMemo(() => {
    if (!node.contributions || node.contributions.length === 0) return '0';
    const totalStaked = node.contributions.reduce(
      (acc, contributor) => acc + bigIntToNumber(contributor.amount, SENT_DECIMALS),
      0
    );
    return formatNumber(totalStaked);
  }, [node.contributions]);

  return (
    <div className="flex flex-col gap-4">
      {/*<ActionModuleRow*/}
      {/*  label={dictionary('contributors')}*/}
      {/*  tooltip={dictionary('contributorsTooltip')}*/}
      {/*>*/}
      {/*  <span className="flex flex-row flex-wrap items-center gap-2 align-middle">*/}
      {/*    <NodeContributorList contributors={node.contributions} forceExpand showEmptySlots />*/}
      {/*  </span>*/}
      {/*</ActionModuleRow>*/}
      <ActionModuleRow
        label={sessionNodeStakingDictionary('stakedAmount')}
        tooltip={sessionNodeStakingDictionary('stakedAmountDescription')}
      >
        {formattedTotalStakedAmount} {SENT_SYMBOL}
      </ActionModuleRow>
      <ActionModuleRow
        label={sessionNodeDictionary('publicKeyShort')}
        tooltip={sessionNodeDictionary('publicKeyDescription')}
      >
        <PubKey pubKey={node.service_node_pubkey} force="collapse" alwaysShowCopyButton />
      </ActionModuleRow>
      <ActionModuleRow
        label={sessionNodeDictionary('operatorAddress')}
        tooltip={sessionNodeDictionary('operatorAddressTooltip')}
      >
        {node.contributions[0]?.address ? (
          <PubKey pubKey={node.contributions[0]?.address} force="collapse" alwaysShowCopyButton />
        ) : null}
      </ActionModuleRow>
      <ActionModuleRow
        label={sessionNodeDictionary('operatorFee')}
        tooltip={sessionNodeDictionary('operatorFeeDescription')}
      >
        {/** TODO: replace this */}
        {formatPercentage(node.fee / 10000)}
      </ActionModuleRow>
      {/* <SessionTokenInput
        type="number"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        min={node.minContribution}
        max={node.maxContribution}
        className="rounded-xl py-12 text-right text-3xl font-medium"
      /> */}
      <Button data-testid={ButtonDataTestId.Stake_Submit} disabled rounded="lg" size="lg">
        {/* {dictionary('button.submit', { amount: value })} */}
        {generalDictionary('comingSoon')}
      </Button>
    </div>
  );
}

export function NodeStakingFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <ActionModuleRowSkeleton />
      <ActionModuleRowSkeleton />
      <ActionModuleRowSkeleton />
      <ActionModuleRowSkeleton />
      <ActionModuleRowSkeleton />
      <ActionModuleRowSkeleton />
      <ButtonSkeleton rounded="lg" size="lg" />
    </div>
  );
}
