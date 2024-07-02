'use client';

import { formatPercentage } from '@/lib/locale-client';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { SENT_SYMBOL } from '@session/contracts';
import type { OpenNode } from '@session/sent-staking-js/client';
import { TextSeparator } from '@session/ui/components/Separator';
import { StatusIndicator } from '@session/ui/components/StatusIndicator';
import { cn } from '@session/ui/lib/utils';
import { Button } from '@session/ui/ui/button';
import { formatNumber } from '@session/util/maths';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { NodeCard, NodeCardText, NodeCardTitle } from './NodeCard';
import { PubKey } from './PubKey';

const NodeItem = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={className}>{children}</span>
);

const NodeItemSeparator = ({ className }: { className?: string }) => (
  <TextSeparator className={className} />
);

const NodeItemLabel = ({ children }: { children: ReactNode }) => (
  <span className="font-normal"> {children}</span>
);

const NodeItemValue = ({ children }: { children: ReactNode }) => (
  <span className="text-nowrap font-semibold"> {children}</span>
);

const OpenNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: OpenNode }
>(({ className, node, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.open');
  const generalNodeDictionary = useTranslations('sessionNodes.general');
  const titleFormat = useTranslations('modules.title');

  const { pubKey, operatorFee, minContribution, maxContribution } = node;

  const formattedMinContributon = useMemo(() => {
    if (!minContribution) return '0';
    return formatNumber(minContribution);
  }, [minContribution]);

  const formattedMaxContributon = useMemo(() => {
    if (!maxContribution) return '0';
    return formatNumber(maxContribution);
  }, [maxContribution]);

  return (
    <NodeCard
      ref={ref}
      {...props}
      className="flex flex-col items-center justify-between gap-2 align-middle sm:flex-row md:gap-10"
    >
      <div className={cn('text-center sm:text-start', className)}>
        <div className="flex w-full cursor-pointer items-baseline gap-3 text-center align-middle sm:text-start">
          <div className="-mr-2 scale-75 p-0 sm:mr-0 md:scale-100 md:p-0.5">
            <StatusIndicator status="green" />
          </div>
          <NodeCardTitle className="inline-flex flex-wrap gap-2 text-sm md:text-lg">
            <span className="text-nowrap font-normal">
              {titleFormat('format', { title: generalNodeDictionary('publicKeyShort') })}
            </span>
            <PubKey pubKey={pubKey} />
          </NodeCardTitle>
        </div>
        <NodeCardText className="col-span-10 mt-1 inline-flex max-h-max flex-row-reverse justify-center gap-2 text-center align-middle text-xs font-normal sm:justify-start sm:text-start md:mt-0 md:flex-row md:text-base">
          <NodeItem>
            <NodeItemLabel>
              {titleFormat('format', { title: dictionary('minContribution') })}
            </NodeItemLabel>
            <NodeItemValue>
              {formattedMinContributon} {SENT_SYMBOL}
            </NodeItemValue>
          </NodeItem>
          <NodeItemSeparator className="hidden md:block" />
          <NodeItem className="hidden md:block">
            <NodeItemLabel>
              {titleFormat('format', { title: dictionary('maxContribution') })}
            </NodeItemLabel>
            <NodeItemValue>
              {formattedMaxContributon} {SENT_SYMBOL}
            </NodeItemValue>
          </NodeItem>
          <NodeItemSeparator />
          <NodeItem>
            <NodeItemLabel>
              {titleFormat('format', { title: generalNodeDictionary('operatorFeeShort') })}
            </NodeItemLabel>
            <NodeItemValue>{formatPercentage(operatorFee)}</NodeItemValue>
          </NodeItem>
        </NodeCardText>
      </div>
      <Link href={`/stake/node/${node.pubKey}`} className="w-full sm:w-auto">
        <Button
          variant="outline"
          size="md"
          rounded="md"
          aria-label={dictionary('viewButton.ariaLabel')}
          data-testid={ButtonDataTestId.Node_Card_Stake}
          className="w-full sm:w-auto"
        >
          {dictionary('viewButton.text')}
        </Button>
      </Link>
    </NodeCard>
  );
});
OpenNodeCard.displayName = 'OpenNodeCard';

export { OpenNodeCard };
