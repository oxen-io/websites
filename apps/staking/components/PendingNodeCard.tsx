'use client';

import { ButtonDataTestId } from '@/testing/data-test-ids';
import { useTranslations } from 'next-intl';
import { forwardRef, type HTMLAttributes } from 'react';
import type { Registration } from '@session/sent-staking-js/client';
import { InfoNodeCard, NodeItem, NodeItemLabel, NodeItemValue } from '@/components/InfoNodeCard';

const PendingNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: Registration }
>(({ className, node, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.pending');
  const titleFormat = useTranslations('modules.title');
  console.log(node);
  const { pubkey_ed25519: pubKey, type: nodeType } = node;

  return (
    <InfoNodeCard
      ref={ref}
      className={className}
      pubKey={pubKey}
      button={{
        ariaLabel: dictionary('registerButton.ariaLabel'),
        text: dictionary('registerButton.text'),
        dataTestId: ButtonDataTestId.Node_Card_Register,
        link: `/stake/${pubKey}/register`,
      }}
      {...props}
    >
      <NodeItem>
        <NodeItemLabel>{titleFormat('format', { title: dictionary('type') })}</NodeItemLabel>
        <NodeItemValue>{dictionary(nodeType === 'solo' ? 'solo' : 'multi')}</NodeItemValue>
      </NodeItem>
    </InfoNodeCard>
  );
});

PendingNodeCard.displayName = 'PendingNodeCard';

export { PendingNodeCard };
