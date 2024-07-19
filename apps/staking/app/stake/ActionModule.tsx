'use client';

import {
  ModuleGrid,
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { QuestionIcon } from '@session/ui/icons/QuestionIcon';
import { cn } from '@session/ui/lib/utils';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Skeleton } from '@session/ui/ui/skeleton';
import { Tooltip } from '@session/ui/ui/tooltip';

type ActionModuleProps = {
  title?: string;
  children?: ReactNode;
  headerAction?: ReactNode;
  background?: keyof typeof actionModuleBackground;
  className?: string;
  contentClassName?: string;
};

export default function ActionModule({
  title,
  headerAction,
  background,
  children,
  className,
  contentClassName,
}: ActionModuleProps) {
  return (
    <ModuleGrid
      variant="section"
      colSpan={1}
      className={cn('h-full w-full', className)}
      style={background ? actionModuleBackground[background] : undefined}
    >
      <ModuleGridHeader keepDesktopHeaderOnMobile>
        {title ? (
          <>
            <ModuleGridTitle>{title}</ModuleGridTitle>
            {headerAction}
          </>
        ) : null}
      </ModuleGridHeader>
      <ModuleGridContent className={cn('overflow-y-auto p-8', contentClassName)}>
        {children}
      </ModuleGridContent>
    </ModuleGrid>
  );
}

export const actionModuleBackground = {
  1: {
    background: 'url(/images/action-module-background-1.png)',
    backgroundPositionX: '85%',
    backgroundPositionY: 'bottom',
    backgroundSize: '150%',
    backgroundRepeat: 'no-repeat',
  },
  2: {
    background: 'url(/images/action-module-background-2.png)',
    backgroundPositionX: '0%',
    backgroundPositionY: 'bottom',
    backgroundSize: '150%',
    backgroundRepeat: 'no-repeat',
  },
  3: {
    background: 'url(/images/action-module-background-3.png)',
    backgroundPositionX: '0%',
    backgroundPositionY: 'bottom',
    backgroundSize: '150%',
    backgroundRepeat: 'no-repeat',
  },
};

export const ActionModuleTooltip = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <Tooltip ref={ref} tooltipContent={children}>
      <div className={cn('cursor-pointer', className)} {...props}>
        <QuestionIcon className="fill-session-text h-4 w-4" />
      </div>
    </Tooltip>
  )
);
ActionModuleTooltip.displayName = 'ModuleTooltip';

export const ActionModuleRow = ({
  label,
  tooltip,
  children,
}: {
  label: string;
  tooltip: string;
  children: ReactNode;
}) => (
  <div className="flex flex-row flex-wrap items-center justify-between">
    <span className="inline-flex items-center gap-2 text-nowrap align-middle">
      {label}
      <ActionModuleTooltip>{tooltip}</ActionModuleTooltip>
    </span>
    <div>{children}</div>
  </div>
);

export const ActionModuleRowSkeleton = () => (
  <div className="flex flex-row flex-wrap items-center justify-between">
    <Skeleton className="h-5 w-full max-w-32" />
    <Skeleton className="h-5 w-full max-w-48" />
  </div>
);

export const ActionModuleDivider = () => <div className="bg-gray-dark h-px w-full" />;
