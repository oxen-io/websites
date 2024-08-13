'use client';

import { formatPercentage } from '@/lib/locale-client';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { SENT_SYMBOL } from '@session/contracts';
import type { OpenNode } from '@session/sent-staking-js/client';
import { useTranslations } from 'next-intl';
import { forwardRef, type HTMLAttributes } from 'react';
import {
  InfoNodeCard,
  NodeItem,
  NodeItemLabel,
  NodeItemSeparator,
  NodeItemValue,
} from '@/components/InfoNodeCard';

const OpenNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: OpenNode }
>(({ className, node, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.open');
  const generalNodeDictionary = useTranslations('sessionNodes.general');
  const titleFormat = useTranslations('modules.title');

  const { service_node_pubkey: pubKey, fee } = node;

  return (
    <InfoNodeCard
      ref={ref}
      className={className}
      pubKey={pubKey}
      statusIndicatorColour="blue"
      button={{
        ariaLabel: dictionary('viewButton.ariaLabel'),
        text: dictionary('viewButton.text'),
        dataTestId: ButtonDataTestId.Node_Card_View,
        link: `/stake/${pubKey}`,
      }}
      {...props}
    >
      <NodeItem>
        <NodeItemLabel className="inline-flex md:hidden">
          {titleFormat('format', { title: dictionary('min') })}
        </NodeItemLabel>
        <NodeItemLabel className="hidden md:inline-flex">
          {titleFormat('format', { title: dictionary('minContribution') })}
        </NodeItemLabel>
        <NodeItemValue>
          {1} {SENT_SYMBOL}
        </NodeItemValue>
      </NodeItem>
      <NodeItemSeparator className="hidden md:block" />
      <NodeItem className="hidden md:block">
        <NodeItemLabel>{titleFormat('format', { title: dictionary('max') })}</NodeItemLabel>
        <NodeItemValue>
          {10} {SENT_SYMBOL}
        </NodeItemValue>
      </NodeItem>
      <NodeItemSeparator />
      <NodeItem>
        <NodeItemLabel>
          {titleFormat('format', { title: generalNodeDictionary('operatorFeeShort') })}
        </NodeItemLabel>
        {/** TODO: replace this */}
        <NodeItemValue>{formatPercentage(fee / 10000)}</NodeItemValue>
      </NodeItem>
    </InfoNodeCard>
  );
});
OpenNodeCard.displayName = 'OpenNodeCard';

export { OpenNodeCard };
