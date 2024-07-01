'use client';

import { formatPercentage } from '@/lib/locale-client';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { SENT_SYMBOL } from '@session/contracts';
import { OpenNode } from '@session/sent-staking-js';
import { TextSeparator } from '@session/ui/components/Separator';
import { StatusIndicator } from '@session/ui/components/StatusIndicator';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { PubKey } from './PubKey';

const NodeItem = ({ children }: { children: ReactNode }) => <span className="">{children}</span>;

const NodeItemSeparator = () => <TextSeparator className="hidden md:block" />;

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
          <NodeCardTitle className="inline-flex flex-wrap gap-2">
            <span className="text-nowrap font-normal">
              {titleFormat('format', { title: generalNodeDictionary('publicKeyShort') })}
            </span>
            <PubKey pubKey={pubKey} />
          </NodeCardTitle>
        </div>
        <NodeCardText className="col-span-10 mt-2 inline-flex max-h-max flex-col gap-2 align-middle font-normal md:mt-0 md:flex-row">
          <NodeItem>
            <NodeItemLabel>
              {titleFormat('format', { title: dictionary('minContribution') })}
            </NodeItemLabel>
            <NodeItemValue>
              {minContribution} {SENT_SYMBOL}
            </NodeItemValue>
          </NodeItem>
          <NodeItemSeparator />
          <NodeItem>
            <NodeItemLabel>
              {titleFormat('format', { title: dictionary('maxContribution') })}
            </NodeItemLabel>
            <NodeItemValue>
              {maxContribution} {SENT_SYMBOL}
            </NodeItemValue>
          </NodeItem>
          <NodeItemSeparator />
          <NodeItem>
            <NodeItemLabel>
              {titleFormat('format', { title: generalNodeDictionary('operatorFee') })}
            </NodeItemLabel>
            <NodeItemValue>{formatPercentage(operatorFee)}</NodeItemValue>
          </NodeItem>
        </NodeCardText>
      </div>
      <div>
        <Link href={`/stake/node/${node.pubKey}`}>
          <Button
            variant="outline"
            size="lg"
            aria-label={dictionary('viewButton.ariaLabel')}
            data-testid={ButtonDataTestId.Node_Card_Stake}
          >
            {dictionary('viewButton.text')}
          </Button>
        </Link>
      </div>
    </NodeCard>
  );
});
OpenNodeCard.displayName = 'OpenNodeCard';

export { OpenNodeCard };
