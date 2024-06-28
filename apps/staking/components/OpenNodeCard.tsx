'use client';

import { formatPercentage } from '@/lib/locale-client';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { SENT_SYMBOL } from '@session/contracts';
import { TextSeparator } from '@session/ui/components/Separator';
import { StatusIndicator } from '@session/ui/components/StatusIndicator';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import { forwardRef, type HTMLAttributes } from 'react';
import { NodeCard, NodeCardText, NodeCardTitle, NodePubKey } from './NodeCard';

export interface OpenNode {
  pubKey: string;
  operatorFee: number;
  minContribution: number;
  maxContribution: number;
}

const OpenNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: OpenNode }
>(({ className, node, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.open');
  const { pubKey, operatorFee, minContribution, maxContribution } = node;

  return (
    <NodeCard
      ref={ref}
      {...props}
      className="flex flex-row items-center justify-between gap-10 align-middle"
    >
      <div className={className}>
        <div className="flex w-full cursor-pointer items-baseline gap-3 align-middle">
          <div className="p-0.5">
            <StatusIndicator status="green" />
          </div>
          <NodeCardTitle className="inline-flex gap-2">
            <span className="text-nowrap font-normal">{dictionary('title')}</span>
            <NodePubKey pubKey={pubKey} />
          </NodeCardTitle>
        </div>
        <NodeCardText className="col-span-10 inline-flex max-h-max gap-2 align-middle font-normal">
          <span>
            {dictionary('minContribution')}{' '}
            <b>
              {minContribution} {SENT_SYMBOL}
            </b>
          </span>
          <TextSeparator />
          <span>
            {dictionary('maxContribution')}{' '}
            <b>
              {maxContribution} {SENT_SYMBOL}
            </b>
          </span>
          <TextSeparator />
          <span>
            {dictionary('fee')} <b>{formatPercentage(operatorFee)}</b>
          </span>
        </NodeCardText>
      </div>
      <div>
        <Button variant="outline" size="lg" data-testid={ButtonDataTestId.Node_Card_Stake}>
          {dictionary('button.text')}
        </Button>
      </div>
    </NodeCard>
  );
});
OpenNodeCard.displayName = 'OpenNodeCard';

export { OpenNodeCard };
