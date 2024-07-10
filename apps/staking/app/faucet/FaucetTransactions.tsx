'use client';

import { PubKey } from '@/components/PubKey';
import { TICKER } from '@/lib/constants';
import { formatLocalizedRelativeTimeToNowClient } from '@/lib/locale-client';
import { SENT_DECIMALS, SENT_SYMBOL } from '@session/contracts';
import { LinkOutIcon } from '@session/ui/icons/LinkOutIcon';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@session/ui/ui/table';
import { formatBigIntTokenValue } from '@session/util/maths';
import { ETH_DECIMALS } from '@session/wallet/lib/eth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';
import { TransactionHistory } from './utils';

interface TransactionRow {
  date: Date;
  hash: string;
  amount: string;
  token: typeof SENT_SYMBOL | typeof TICKER.ETH;
}

export function FaucetTransactions({
  transactionHistory,
}: {
  transactionHistory: Array<TransactionHistory>;
}) {
  const dictionary = useTranslations('actionModules.node');

  const transactions = useMemo(() => {
    const rows: Array<TransactionRow> = [];

    transactionHistory.forEach(({ timestamp, hash, amount, ethhash, ethamount }) => {
      if (ethhash && ethamount) {
        rows.push({
          date: new Date(timestamp),
          hash: ethhash,
          amount: ethamount,
          token: TICKER.ETH,
        });
      }

      if (hash && amount) {
        rows.push({
          date: new Date(timestamp),
          hash,
          amount,
          token: SENT_SYMBOL,
        });
      }
    });
    return rows;
  }, [transactionHistory]);

  return (
    <Table>
      <TableCaption>A list of your faucet transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          <TableHead>Hash</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(({ date, hash, amount, token }) => (
          <TableRow key={hash}>
            <TableCell className="font-medium">
              {formatLocalizedRelativeTimeToNowClient(date, { addSuffix: true })}
            </TableCell>
            <TableCell>
              <PubKey pubKey={hash} force="collapse" alwaysShowCopyButton />
            </TableCell>
            <TableCell className="text-right">
              {formatBigIntTokenValue(
                BigInt(amount),
                token === SENT_SYMBOL ? SENT_DECIMALS : ETH_DECIMALS
              )}
              {` ${token}`}
            </TableCell>
            <TableCell>
              <Link href={`/explorer/${hash}`} target="_blank">
                <span className="text-session-green fill-session-green inline-flex items-center gap-1 align-middle">
                  {dictionary('viewOnExplorer')}
                  <LinkOutIcon className="h-4 w-4" />
                </span>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
