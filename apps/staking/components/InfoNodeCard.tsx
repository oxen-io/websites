'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { useTranslations } from 'next-intl';
import { NodeCard, NodeCardText, NodeCardTitle } from '@/components/NodeCard';
import { cn } from '@session/ui/lib/utils';
import {
  StatusIndicator,
  type StatusIndicatorVariants,
} from '@session/ui/components/StatusIndicator';
import { PubKey } from '@/components/PubKey';
import Link from 'next/link';
import { Button, ButtonSkeleton } from '@session/ui/ui/button';
import { Skeleton } from '@session/ui/ui/skeleton';
import { TextSeparator } from '@session/ui/components/Separator';

export type InfoNodeCardProps = HTMLAttributes<HTMLDivElement> & {
  pubKey: string;
  button?: {
    text: string;
    link: string;
    dataTestId: ButtonDataTestId;
    ariaLabel: string;
  };
  statusIndicatorColour?: StatusIndicatorVariants['status'];
};

export const InfoNodeCard = forwardRef<HTMLDivElement, InfoNodeCardProps>(
  ({ statusIndicatorColour, className, pubKey, button, children, ...props }, ref) => {
    const generalNodeDictionary = useTranslations('sessionNodes.general');
    const titleFormat = useTranslations('modules.title');
    return (
      <NodeCard
        ref={ref}
        {...props}
        className="flex flex-col items-center justify-between gap-2 align-middle sm:flex-row md:gap-10"
      >
        <div className={cn('text-center sm:text-start', className)}>
          <div className="flex w-full cursor-pointer items-baseline gap-3 text-center align-middle sm:text-start">
            {statusIndicatorColour ? (
              <div className="-mr-2 scale-75 p-0 sm:mr-0 md:scale-100 md:p-0.5">
                <StatusIndicator status={statusIndicatorColour} />
              </div>
            ) : null}
            <NodeCardTitle className="inline-flex flex-wrap gap-2 text-sm md:text-lg">
              <span className="text-nowrap font-normal">
                {titleFormat('format', { title: generalNodeDictionary('publicKeyShort') })}
              </span>
              <PubKey pubKey={pubKey} force="collapse" />
            </NodeCardTitle>
          </div>
          <NodeCardText className="col-span-10 mt-1 inline-flex max-h-max flex-row-reverse justify-center gap-2 text-center align-middle text-xs font-normal sm:justify-start sm:text-start md:mt-0 md:flex-row md:text-base">
            {children}
          </NodeCardText>
        </div>
        {button ? (
          <Link href={button.link} className="w-full sm:w-auto" prefetch>
            <Button
              variant="outline"
              size="md"
              rounded="md"
              aria-label={button.ariaLabel}
              data-testid={button.dataTestId}
              className="w-full sm:w-auto"
            >
              {button.text}
            </Button>
          </Link>
        ) : null}
      </NodeCard>
    );
  }
);

export function InfoNodeCardSkeleton() {
  return (
    <div className="border-muted flex w-full flex-row items-center justify-between gap-3 rounded-xl border-2 p-6">
      <div className="-bottom-1/2 flex w-full flex-col gap-3">
        <div className="flex w-full items-center gap-3 align-middle">
          <div className="-mr-2 scale-75 p-0 sm:mr-0 md:scale-100 md:p-0.5">
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="inline-flex gap-2">
            <Skeleton className="h-6 w-40 sm:w-60" />
          </div>
        </div>
        <Skeleton className="h-4 w-9/12" />
      </div>
      <ButtonSkeleton variant="outline" rounded="md" className="h-8 w-16" />
    </div>
  );
}

export const NodeItem = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={className}>{children}</span>
);

export const NodeItemSeparator = ({ className }: { className?: string }) => (
  <TextSeparator className={className} />
);

export const NodeItemLabel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <span className={cn('font-normal', className)}> {children}</span>;

export const NodeItemValue = ({ children }: { children: ReactNode }) => (
  <span className="text-nowrap font-semibold"> {children}</span>
);
