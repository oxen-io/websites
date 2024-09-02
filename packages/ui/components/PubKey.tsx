'use client';

import { CopyToClipboardButton } from './CopyToClipboardButton';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/tooltip';
import { collapseString } from '@session/util/string';
import { forwardRef, HTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';
import { ButtonDataTestId } from '../data-test-ids';

type CollapseStringsParams = Parameters<typeof collapseString>;

type PubKeyType = HTMLAttributes<HTMLDivElement> & {
  pubKey: string;
  leadingChars?: CollapseStringsParams[1];
  trailingChars?: CollapseStringsParams[2];
  expandOnHover?: boolean;
  alwaysShowCopyButton?: boolean;
  force?: 'expand' | 'collapse';
};

export const PubKey = forwardRef<HTMLDivElement, PubKeyType>((props, ref) => {
  const {
    className,
    pubKey,
    leadingChars,
    trailingChars,
    expandOnHover,
    alwaysShowCopyButton,
    force,
    ...rest
  } = props;
  const [isExpanded, setIsExpanded] = useState(force === 'expand');
  const collapsedPubKey = useMemo(
    () => (pubKey ? collapseString(pubKey, leadingChars ?? 6, trailingChars ?? 6) : ''),
    [pubKey]
  );

  const handleSelectionChange = useCallback(() => {
    if (force === 'expand' || force === 'collapse') return;

    const selection = window.getSelection();
    if (selection?.toString().includes(pubKey) || selection?.toString().includes(collapsedPubKey)) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [pubKey, collapsedPubKey, force]);

  useEffect(() => {
    /**
     * Keeps the full pubkey visible when selected.
     */
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  return (
    <span ref={ref} className={cn('group flex select-all items-center', className)} {...rest}>
      {!isExpanded ? (
        <Tooltip tooltipContent={<p>{pubKey}</p>} triggerProps={{ disabled: expandOnHover }}>
          <span
            className={cn(
              'select-all break-all',
              force !== 'collapse' && expandOnHover && 'group-hover:hidden',
              force !== 'collapse' && expandOnHover && isExpanded ? 'hidden' : 'block'
            )}
          >
            {collapsedPubKey}
          </span>
        </Tooltip>
      ) : null}
      <div
        className={cn(
          'select-all break-all',
          force !== 'collapse' && expandOnHover && 'group-hover:block',
          (force !== 'collapse' && expandOnHover && isExpanded) || isExpanded ? 'block' : 'hidden'
        )}
      >
        {pubKey}
      </div>
      <CopyToClipboardButton
        className={cn(
          'group-hover:bg-session-green group-hover:text-session-black *:group-hover:fill-session-black mx-1 p-0.5 duration-0 group-hover:opacity-100',
          alwaysShowCopyButton || isExpanded ? 'opacity-100' : 'opacity-0'
        )}
        textToCopy={pubKey}
        data-testid={ButtonDataTestId.Copy_Pub_key_To_Clipboard}
        aria-label={'Copy to Clipboard'}
        copyToClipboardToastMessage={'Copied to clipboard!'}
      />
    </span>
  );
});
PubKey.displayName = 'PubKey';
