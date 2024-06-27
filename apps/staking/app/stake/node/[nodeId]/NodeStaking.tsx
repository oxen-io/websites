'use client';

import { NodeContributorList, NodePubKey } from '@/components/NodeCard';
import useSentBalance from '@/hooks/balance';
import { formatPercentage } from '@/lib/locale-client';
import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { GetOpenNodesResponse } from '@session/sent-staking-js';
import { Loading } from '@session/ui/components/loading';
import { Button } from '@session/ui/ui/button';
import { Input } from '@session/ui/ui/input';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ActionModuleDivider, ActionModuleRow, ActionModuleTooltip } from '../../ActionModule';

export default function NodeStaking({ nodeId }: { nodeId: string }) {
  const { address } = useWallet();
  const { data, isLoading } = useSessionStakingQuery({
    query: 'getOpenNodes',
    args: { userAddress: address! },
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

type StakeAmountInputProps = {
  minContribution: number;
  maxContribution: number;
};

export function NodeStakingForm({ node }: { node: GetOpenNodesResponse['nodes'][number] }) {
  const { balance } = useSentBalance();
  const [value, setValue] = useState<number>(node.minContribution);
  const dictionary = useTranslations('actionModules.node');

  return (
    <div className="flex flex-col gap-4 px-9">
      <ActionModuleRow
        label={dictionary('contributors')}
        tooltip={dictionary('contributorsTooltip')}
      >
        <span className="flex flex-row flex-wrap items-center align-middle">
          <NodeContributorList contributors={node.contributors} forceExpand showEmptySlots />
        </span>
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow label={dictionary('snKey')} tooltip={dictionary('snKeyTooltip')}>
        <NodePubKey pubKey={node.pubKey} />
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={dictionary('operatorAddress')}
        tooltip={dictionary('operatorAddressTooltip')}
      >
        {node.operatorAddress}
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow label={dictionary('operatorFee')} tooltip={dictionary('operatorFeeTooltip')}>
        {formatPercentage(node.operatorFee)}
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={dictionary('minimumContribution')}
        tooltip={dictionary('minimumContributionTooltip')}
      >
        {node.minContribution}
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={dictionary('maximumContribution')}
        tooltip={dictionary('maximumContributionTooltip')}
      >
        {node.maxContribution}
      </ActionModuleRow>
      <ActionModuleDivider />
      <span className="inline-flex items-center gap-2 align-middle text-xl font-medium">
        {dictionary('stakeAmount')}
        <ActionModuleTooltip>{dictionary('stakeAmountTooltip')}</ActionModuleTooltip>
      </span>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        min={node.minContribution}
        max={node.maxContribution}
        className="rounded-xl py-12 text-right text-3xl font-medium"
      />
      <span className="inline-flex w-full items-center justify-end gap-2 align-middle text-xl font-medium">
        Balance: {balance}
        <span className="text-session-green">Max</span>
      </span>
      <Button>{dictionary('button.submit', { amount: value })}</Button>
    </div>
  );
}
