import { Loading } from '@session/ui/components/loading';
import { HumanIcon } from '@session/ui/icons/HumanIcon';
import { cn } from '@session/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@session/ui/ui/tooltip';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, useMemo } from 'react';
import { bigIntToNumber } from '@session/util/maths';
import { SENT_DECIMALS } from '@session/contracts';

export interface Contributor {
  address: string;
  amount: bigint;
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

export const getTotalStakedAmountForAddress = (
  contributors: Contributor[],
  address: string
): number => {
  return contributors.reduce((acc, { amount, address: contributorAddress }) => {
    return `0x${contributorAddress}`.toUpperCase() === address.toUpperCase()
      ? acc + bigIntToNumber(amount, SENT_DECIMALS)
      : acc;
  }, 0);
};

type StakedNodeContributorListProps = HTMLAttributes<HTMLDivElement> & {
  contributors: Contributor[];
  showEmptySlots?: boolean;
  forceExpand?: boolean;
};

const NodeContributorList = forwardRef<HTMLDivElement, StakedNodeContributorListProps>(
  ({ className, contributors, showEmptySlots, forceExpand, ...props }, ref) => {
    const { address: userAddress } = useWallet();

    const [mainContributor, ...otherContributors] = useMemo(() => {
      const userContributor = contributors.find(({ address }) => address === userAddress);
      const otherContributors = contributors.filter(({ address }) => address !== userAddress);
      // TODO - add contributor list sorting
      //.sort((a, b) => b.amount - a.amount);

      return userContributor ? [userContributor, ...otherContributors] : otherContributors;
    }, [contributors]);

    const emptyContributorSlots = useMemo(
      () =>
        showEmptySlots
          ? Array.from(
              {
                length: 10 - contributors.length,
              },
              (_, index) => `empty-slot-${index}`
            )
          : [],
      [showEmptySlots, contributors.length]
    );

    return (
      <>
        <ContributorIcon
          className="-mr-1"
          contributor={mainContributor}
          isUser={mainContributor?.address === userAddress}
        />
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
            ? emptyContributorSlots.map((key) => (
                <ContributorIcon key={key} className="fill-text-primary h-4" />
              ))
            : null}
          <span
            className={cn(
              'letter mt-0.5 block text-lg tracking-widest transition-all duration-300 ease-in-out'
            )}
          >
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
  innerNodeCardVariants,
};
