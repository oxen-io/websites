import { ButtonDataTestId } from '@/testing/data-test-ids';
import { CopyToClipboardButton } from '@session/ui/components/CopyToClipboardButton';
import { cn } from '@session/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@session/ui/ui/tooltip';
import { collapseString } from '@session/util/string';
import { useTranslations } from 'next-intl';
import { HTMLAttributes, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

type PubKeyType = HTMLAttributes<HTMLDivElement> & {
  pubKey: string;
  leadingChars?: number;
  trailingChars?: number;
  expandOnHover?: boolean;
  alwaysShowCopyButton?: boolean;
  forceExpand?: boolean;
};

const PubKey = forwardRef<HTMLDivElement, PubKeyType>(
  (
    {
      className,
      pubKey,
      leadingChars,
      trailingChars,
      expandOnHover,
      alwaysShowCopyButton,
      forceExpand,
      ...props
    },
    ref
  ) => {
    const dictionary = useTranslations('clipboard');
    const [isExpanded, setIsExpanded] = useState(forceExpand ?? false);
    const collapsedPubKey = useMemo(
      () => collapseString(pubKey, leadingChars ?? 6, trailingChars ?? 6),
      [pubKey]
    );

    const handleSelectionChange = useCallback(() => {
      if (forceExpand) return;

      const selection = window.getSelection();
      if (
        selection?.toString().includes(pubKey) ||
        selection?.toString().includes(collapsedPubKey)
      ) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    }, [pubKey]);

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
      <span ref={ref} className={cn('group flex select-all', className)} {...props}>
        {!isExpanded ? (
          <Tooltip>
            <TooltipTrigger asChild disabled={expandOnHover}>
              <span
                className={cn(
                  'select-all break-all',
                  expandOnHover && 'group-hover:hidden',
                  expandOnHover && isExpanded ? 'hidden' : 'block'
                )}
              >
                {collapsedPubKey}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{pubKey}</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
        <div
          className={cn(
            'select-all break-all',
            expandOnHover && 'group-hover:block',
            (expandOnHover && isExpanded) || isExpanded ? 'block' : 'hidden'
          )}
        >
          {pubKey}
        </div>
        <CopyToClipboardButton
          className={cn(
            'group-hover:block',
            alwaysShowCopyButton || isExpanded ? 'block' : 'hidden'
          )}
          textToCopy={pubKey}
          data-testid={ButtonDataTestId.Copy_Public_Key_To_Clipboard}
          aria-label={dictionary('copyToClipboard')}
          copyToClipboardToastMessage={dictionary('copyToClipboardSuccessToast')}
        />
      </span>
    );
  }
);
PubKey.displayName = 'PubKey';

export { PubKey };
