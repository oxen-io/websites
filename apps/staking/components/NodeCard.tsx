import { ButtonDataTestId } from '@/testing/data-test-ids';
import { CopyToClipboardButton } from '@session/ui/components/CopyToClipboardButton';
import { Loading } from '@session/ui/components/loading';
import { cn } from '@session/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useMemo, useState, type HTMLAttributes } from 'react';

export const outerNodeCardVariants = cva(
  'rounded-[20px] hover:cursor-pointer transition-all ease-in-out bg-gradient-to-br from-[#7FB1AE] to-[#2A4337] bg-blend-lighten shadow-md p-px',
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
  'rounded-[20px] w-full h-full flex align-middle flex-col py-8 px-9 from-[#090F0D] to-[#081310] bg-gradient-to-br',
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
      <div className={cn(outerNodeCardVariants({ variant, className }))}>
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
      className={cn(
        'font-atyp-display bg-gradient-to-br from-[#FFFFFF] to-[#B3CBC5] bg-clip-text text-xl font-normal leading-none text-transparent md:text-3xl',
        className
      )}
      {...props}
    />
  )
);
NodeCardTitle.displayName = 'NodeCardTitle';

const NodeCardText = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'font-atyp-display bg-gradient-to-br from-[#FFFFFF] to-[#79A499] bg-clip-text text-base font-extralight text-transparent md:text-lg',
        className
      )}
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
      <div ref={ref} className={cn('group flex select-all', className)} {...props}>
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
          <span>{pubKey}</span>
        </div>
        <CopyToClipboardButton
          className={cn('hidden group-hover:block', isSelected ? 'block' : 'hidden')}
          textToCopy={pubKey}
          data-testid={ButtonDataTestId.Copy_Node_Id_To_Clipboard}
          aria-label={dictionary('copyPubkeyToClipboard')}
          copyToClipboardToastMessage={dictionary('copyPubkeyToClipboardSuccessToast')}
        />
      </div>
    );
  }
);
NodePubKey.displayName = 'NodePubKey';

export { NodeCard, NodeCardHeader, NodeCardText, NodeCardTitle, NodePubKey, innerNodeCardVariants };
