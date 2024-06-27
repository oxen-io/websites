'use client';
import { ModuleGrid, ModuleGridHeader, ModuleGridTitle } from '@session/ui/components/ModuleGrid';
import { QuestionIcon } from '@session/ui/icons/QuestionIcon';
import { cn } from '@session/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@session/ui/ui/tooltip';
import { HTMLAttributes, forwardRef } from 'react';

type ActionModuleProps = {
  title?: string;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
  background?: keyof typeof actionModuleBackground;
};

export default function ActionModule({
  title,
  headerAction,
  background,
  children,
}: ActionModuleProps) {
  return (
    <ModuleGrid
      variant="section"
      colSpan={1}
      className="h-full w-full overflow-y-auto"
      style={background ? actionModuleBackground[background] : undefined}
    >
      {title ? (
        <ModuleGridHeader>
          <ModuleGridTitle>{title}</ModuleGridTitle>
          {headerAction}
        </ModuleGridHeader>
      ) : null}
      {children}
    </ModuleGrid>
  );
}

export const actionModuleBackground = {
  1: {
    background: 'url(/images/action-module-background-1.png)',
    backgroundPositionX: '85%',
    backgroundPositionY: 'bottom',
    backgroundSize: '350%',
    backgroundRepeat: 'no-repeat',
  },
  2: {
    background: 'url(/images/action-module-background-2.png)',
    backgroundPositionX: '35%',
    backgroundPositionY: 'bottom',
    backgroundSize: '150%',
  },
  3: {
    background: 'url(/images/action-module-background-3.png)',
    backgroundPositionX: '35%',
    backgroundPositionY: 'bottom',
    backgroundSize: '150%',
  },
};

export const ActionModuleTooltip = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div ref={ref} className={cn('cursor-pointer', className)} {...props}>
          <QuestionIcon className="fill-session-text h-4 w-4" />
        </div>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
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
  children: React.ReactNode;
}) => (
  <div className="flex flex-row items-center justify-between">
    <span className="inline-flex items-center gap-2 align-middle text-xl font-medium">
      {label}
      <ActionModuleTooltip>{tooltip}</ActionModuleTooltip>
    </span>
    <div>{children}</div>
  </div>
);

export const ActionModuleDivider = () => <div className="bg-gray-dark h-px w-full" />;
