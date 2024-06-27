import { ButtonDataTestId } from '@/testing/data-test-ids';
import { CopyToClipboardButton } from '@session/ui/components/CopyToClipboardButton';
import { Loading } from '@session/ui/components/loading';
import { HumanIcon } from '@session/ui/icons/HumanIcon';
import { cn } from '@session/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@session/ui/ui/tooltip';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useMemo, useState, type HTMLAttributes } from 'react';

export interface Contributor {
  address: string;
  amount: number;
}

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

type NodePubKeyType = HTMLAttributes<HTMLDivElement> & {
  pubKey: string;
  expandOnHover?: boolean;
};

const NodePubKey = forwardRef<HTMLDivElement, NodePubKeyType>(
  ({ className, pubKey, expandOnHover, ...props }, ref) => {
    const dictionary = useTranslations('nodeCard.pubKey');
    const [isSelected, setIsSelected] = useState(false);
    const [pubKeyStart, pubKeyEnd] = useMemo(() => getPublicKeyEnds(pubKey), [pubKey]);

    useEffect(() => {
      /**
       * Keeps the full pubkey visible when selected.
       */
      const handleSelectionChange = () => {
        const selection = window.getSelection();
        if (selection?.toString().includes(pubKey) || selection?.toString().includes(pubKeyStart)) {
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
        <Tooltip>
          <TooltipTrigger asChild disabled={expandOnHover}>
            <span
              className={cn(
                'select-all break-all',
                expandOnHover && 'group-hover:hidden',
                expandOnHover && isSelected ? 'hidden' : 'block'
              )}
            >
              {pubKeyStart}...{pubKeyEnd}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{pubKey}</p>
          </TooltipContent>
        </Tooltip>
        <div
          className={cn(
            'select-all break-all',
            expandOnHover && 'group-hover:block',
            expandOnHover && isSelected ? 'block' : 'hidden'
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

const ContributorIcon = ({
  className,
  contributor,
  isUser,
}: {
  className?: string;
  contributor?: Contributor;
  isUser?: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <HumanIcon
        className={cn('fill-text-primary h-4 w-4 cursor-pointer', className)}
        full={Boolean(contributor)}
      />
    </TooltipTrigger>
    <TooltipContent>
      <p>
        {contributor
          ? `${isUser ? 'You' : ''} ${contributor.address} | ${contributor.amount}`
          : 'Empty contributor slot'}
      </p>
    </TooltipContent>
  </Tooltip>
);

type StakedNodeContributorListProps = HTMLAttributes<HTMLDivElement> & {
  contributors: Contributor[];
  showEmptySlots?: boolean;
  forceExpand?: boolean;
};

const NodeContributorList = forwardRef<HTMLDivElement, StakedNodeContributorListProps>(
  ({ className, contributors, showEmptySlots, forceExpand, ...props }, ref) => {
    const { address: userAddress } = useWallet();
    const userContributor = contributors.find(({ address }) => address === userAddress);
    const otherContributors = contributors.filter(({ address }) => address !== userAddress);
    return (
      <>
        <ContributorIcon className="-mr-1" contributor={userContributor} isUser />
        <div
          className={cn(
            'flex w-min flex-row items-center overflow-x-hidden align-middle',
            forceExpand
              ? 'md:gap-1 md:[&>span]:w-0 md:[&>span]:opacity-0 md:[&>svg]:w-4'
              : 'md:peer-checked:gap-1 [&>span]:w-max [&>span]:opacity-100 md:peer-checked:[&>span]:w-0 md:peer-checked:[&>span]:opacity-0 [&>svg]:w-0 [&>svg]:transition-all [&>svg]:duration-300 [&>svg]:motion-reduce:transition-none md:peer-checked:[&>svg]:w-4',
            className
          )}
          ref={ref}
          {...props}
        >
          {otherContributors.map((contributor) => (
            <ContributorIcon
              key={contributor.address}
              contributor={contributor}
              className={cn('fill-text-primary h-4')}
            />
          ))}
          {showEmptySlots
            ? Array.from({
                length: 10 - contributors.length,
              }).map((_, index) => (
                <ContributorIcon key={index} className="fill-text-primary h-4" />
              ))
            : null}
          <span className={cn('mt-0.5 block text-lg transition-all duration-300 ease-in-out')}>
            {contributors.length}
            {showEmptySlots ? '/10' : null}
          </span>
        </div>
      </>
    );
  }
);

export {
  ContributorIcon,
  NodeCard,
  NodeCardHeader,
  NodeCardText,
  NodeCardTitle,
  NodeContributorList,
  NodePubKey,
  innerNodeCardVariants,
};
