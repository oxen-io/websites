'use client';

import { formatSENT } from '@session/contracts';
import { useSENTBalanceQuery } from '@session/contracts/hooks/SENT';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export default function useSENTBalance() {
  const { address } = useAccount();
  const { balance: rawBalance, status, refetch } = useSENTBalanceQuery({ address });

  const formattedBalance = useMemo(() => (rawBalance ? formatSENT(rawBalance) : 0), [rawBalance]);

  return { balance: formattedBalance, status, refetch };
}
