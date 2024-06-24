import { ButtonDataTestId } from '@/testing/data-test-ids';
import { CopyToClipboardButton } from '@session/ui/components/CopyToClipboardButton';
import { Loading } from '@session/ui/components/loading';
import { cn } from '@session/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useMemo, useState, type HTMLAttributes } from 'react';

export const outerNodeCardVariants = cva(
  'rounded-xl transition-all ease-in-out bg-module-outline bg-blend-lighten shadow-md p-px',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const innerNodeCardVariants = cva(
  'rounded-xl w-full h-full flex align-middle flex-col py-5 px-6 bg-module',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface StakeCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof innerNodeCardVariants> {
  loading?: boolean;
}

const NodeCard = forwardRef<HTMLDivElement, StakeCardProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <div className={cn(outerNodeCardVariants({ variant }))}>
        <div className={cn(innerNodeCardVariants({ variant, className }))} ref={ref} {...props}>
          {loading ? <Loading /> : children}
        </div>
      </div>
    );
  }
);

NodeCard.displayName = 'NodeCard';

const nodeCardHeaderVariants = cva('w-full flex flex-row', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface NodeCardHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof nodeCardHeaderVariants> {
  loading?: boolean;
}

const NodeCardHeader = forwardRef<HTMLDivElement, NodeCardHeaderProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <div className={cn(nodeCardHeaderVariants({ variant, className }))} ref={ref} {...props}>
        {loading ? <Loading /> : children}
      </div>
    );
  }
);
NodeCardHeader.displayName = 'NodeCardHeader';

const NodeCardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn('text-gradient-white text-lg font-medium leading-none md:text-xl', className)}
      {...props}
    />
  )
);
NodeCardTitle.displayName = 'NodeCardTitle';

const NodeCardText = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-gradient-white text-sm font-light md:text-base', className)}
      {...props}
    />
  )
);
NodeCardText.displayName = 'NodeCardText';

function getPublicKeyEnds(pubKey: string): [string, string] {
  const start = pubKey.slice(0, 6);
  const end = pubKey.slice(pubKey.length - 6);
  return [start, end];
}

const NodePubKey = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { pubKey: string }>(
  ({ className, pubKey, ...props }, ref) => {
    const dictionary = useTranslations('nodeCard.pubKey');
    const [isSelected, setIsSelected] = useState(false);
    const [pubKeyStart, pubKeyEnd] = useMemo(() => getPublicKeyEnds(pubKey), [pubKey]);
    useEffect(() => {
      /**
       * Keeps the full pubkey visible when selected.
       */
      const handleSelectionChange = () => {
        const selection = window.getSelection();
        if (selection?.toString().includes(pubKey)) {
          setIsSelected(true);
        } else {
          setIsSelected(false);
        }
      };

      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }, [pubKey]);

    return (
      <span ref={ref} className={cn('group flex select-all', className)} {...props}>
        <span
          className={cn('select-all break-all group-hover:hidden', isSelected ? 'hidden' : 'block')}
        >
          {pubKeyStart}...{pubKeyEnd}
        </span>
        <div
          className={cn(
            'hidden select-all break-all group-hover:block',
            isSelected ? 'block' : 'hidden'
          )}
        >
          {pubKey}
        </div>
        <CopyToClipboardButton
          className={cn('hidden group-hover:block', isSelected ? 'block' : 'hidden')}
          textToCopy={pubKey}
          data-testid={ButtonDataTestId.Copy_Node_Id_To_Clipboard}
          aria-label={dictionary('copyPubkeyToClipboard')}
          copyToClipboardToastMessage={dictionary('copyPubkeyToClipboardSuccessToast')}
        />
      </span>
    );
  }
);
NodePubKey.displayName = 'NodePubKey';

export { NodeCard, NodeCardHeader, NodeCardText, NodeCardTitle, NodePubKey, innerNodeCardVariants };
