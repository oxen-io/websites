'use client';

import { CHAIN, chains, formatSENT } from '@session/contracts';
import { useSENTBalanceQuery } from '@session/contracts/hooks/SENT';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export default function useSentBalance() {
  const { address } = useAccount();
  const {
    balance: rawBalance,
    status,
    refetch,
  } = useSENTBalanceQuery({
    startEnabled: Boolean(address),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- address is defined when the query is enabled so it is safe to use it
    args: [address!],
    chainId: chains[CHAIN.TESTNET].id,
  });

  const formattedBalance = useMemo(() => (rawBalance ? formatSENT(rawBalance) : 0), [rawBalance]);

  return { balance: formattedBalance, status, refetch };
}
