'use client';

import { NodeContributorList, getTotalStakedAmount } from '@/components/NodeCard';
import { PubKey } from '@/components/PubKey';
import { SessionTokenInput } from '@/components/SessionTokenInput';
import { formatPercentage } from '@/lib/locale-client';
import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { SENT_SYMBOL } from '@session/contracts';
import type { GetOpenNodesResponse } from '@session/sent-staking-js/client';
import { Loading } from '@session/ui/components/loading';
import { Button } from '@session/ui/ui/button';
import { formatNumber } from '@session/util/maths';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ActionModuleDivider, ActionModuleRow } from '../../ActionModule';

export default function NodeStaking({ nodeId }: { nodeId: string }) {
  const { data, isLoading } = useSessionStakingQuery({
    query: 'getOpenNodes',
    args: undefined,
  });

  const node = useMemo(() => data?.nodes.find((node) => node.pubKey === nodeId), [data, nodeId]);

  return isLoading ? (
    <Loading />
  ) : node ? (
    <NodeStakingForm node={node} />
  ) : (
    <span>Node not found</span>
  );
}

export function NodeStakingForm({ node }: { node: GetOpenNodesResponse['nodes'][number] }) {
  const [value, setValue] = useState<number>(node.minContribution);
  const dictionary = useTranslations('actionModules.node');
  const sessionNodeDictionary = useTranslations('sessionNodes.general');
  const sessionNodeStakingDictionary = useTranslations('sessionNodes.staking');

  const formattedTotalStakedAmount = useMemo(() => {
    if (!node.contributors || node.contributors.length === 0) return '0';
    return formatNumber(getTotalStakedAmount(node.contributors));
  }, [node.contributors]);

  return (
    <div className="flex flex-col gap-4">
      <ActionModuleRow
        label={dictionary('contributors')}
        tooltip={dictionary('contributorsTooltip')}
      >
        <span className="flex flex-row flex-wrap items-center gap-2 align-middle">
          <NodeContributorList contributors={node.contributors} forceExpand showEmptySlots />
        </span>
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={sessionNodeStakingDictionary('stakedAmount')}
        tooltip={sessionNodeStakingDictionary('stakedAmountDescription')}
      >
        {formattedTotalStakedAmount} {SENT_SYMBOL}
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={sessionNodeDictionary('publicKeyShort')}
        tooltip={sessionNodeDictionary('publicKeyDescription')}
      >
        <PubKey pubKey={node.pubKey} alwaysShowCopyButton />
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={sessionNodeDictionary('operatorAddress')}
        tooltip={sessionNodeDictionary('operatorAddressTooltip')}
      >
        <PubKey pubKey={node.operatorAddress} alwaysShowCopyButton />
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={sessionNodeDictionary('operatorFee')}
        tooltip={sessionNodeDictionary('operatorFeeDescription')}
      >
        {formatPercentage(node.operatorFee)}
      </ActionModuleRow>
      <ActionModuleDivider />
      <SessionTokenInput
        type="number"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        min={node.minContribution}
        max={node.maxContribution}
        className="rounded-xl py-12 text-right text-3xl font-medium"
      />
      <span className="inline-flex w-full items-center justify-end gap-2 align-middle text-xl font-medium">
        <span className="text-session-green">Max</span>
      </span>
      <Button data-testid={ButtonDataTestId.Stake_Submit}>
        {dictionary('button.submit', { amount: value })}
      </Button>
    </div>
  );
}
