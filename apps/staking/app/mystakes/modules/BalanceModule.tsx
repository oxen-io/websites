'use client';

import { ModuleDynamicQueryText } from '@/components/ModuleDynamic';
import { getTotalStakedAmountForAddress } from '@/components/NodeCard';
import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { SENT_SYMBOL } from '@session/contracts';
import { ServiceNode } from '@session/sent-staking-js';
import { Module, ModuleTitle } from '@session/ui/components/Module';
import { formatTokenValue } from '@session/util/maths';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Address } from 'viem';

const getTotalStakedAmount = ({
  nodes,
  address,
}: {
  nodes: Array<ServiceNode>;
  address: Address;
}) => {
  return nodes.reduce(
    (acc, node) => acc + getTotalStakedAmountForAddress(node.contributors, address),
    0
  );
};

function useTotalStakedAmount() {
  const { address } = useWallet();
  const { data, status, refetch } = useSessionStakingQuery({
    query: 'getNodesForEthWallet',
    args: { address: address! },
  });

  const totalStakedAmount = useMemo(() => {
    if (!address || !data) return null;
    return getTotalStakedAmount({ nodes: data?.nodes ?? [], address: address! });
  }, [data, address]);

  return { totalStakedAmount, status, refetch };
}

export default function BalanceModule() {
  const { totalStakedAmount, status, refetch } = useTotalStakedAmount();
  const dictionary = useTranslations('modules.balance');
  const toastDictionary = useTranslations('modules.toast');
  const titleFormat = useTranslations('modules.title');

  const title = dictionary('title', { tokenSymbol: SENT_SYMBOL });

  const formattedTotalStakedAmount = useMemo(() => {
    if (!totalStakedAmount) return '0';
    return formatTokenValue(totalStakedAmount);
  }, [totalStakedAmount]);

  return (
    <Module size="lg" variant="hero">
      <ModuleTitle>{titleFormat('format', { title })}</ModuleTitle>
      <ModuleDynamicQueryText
        status={status}
        fallback={0}
        errorToast={{
          messages: {
            error: toastDictionary('error', { module: title }),
            refetching: toastDictionary('refetching'),
            success: toastDictionary('refetchSuccess'),
          },
          refetch,
        }}
        style={{
          fontSize: `clamp(32px, min(${(formattedTotalStakedAmount?.length ?? 0) / 2}ch, 8vw), 100px)`,
        }}
      >
        {formattedTotalStakedAmount}
      </ModuleDynamicQueryText>
    </Module>
  );
}
