import {
  ModuleGrid,
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridInfoContent,
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
  noHeader?: boolean;
};

export default function ActionModule({
  title,
  headerAction,
  background,
  children,
  className,
  contentClassName,
  noHeader,
}: ActionModuleProps) {
  return (
    <ModuleGrid variant="action" colSpan={1} className={cn('h-full w-full', className)}>
      {!noHeader ? (
        <ModuleGridHeader keepDesktopHeaderOnMobile>
          {title ? (
            <>
              <ModuleGridTitle>{title}</ModuleGridTitle>
              <div className="me-4">{headerAction}</div>
            </>
          ) : null}
        </ModuleGridHeader>
      ) : null}
      <ModuleGridContent className={cn('overflow-y-auto p-8', contentClassName)}>
        {children}
      </ModuleGridContent>
      <div
        className={cn(
          'absolute -z-10 h-full w-full bg-gradient-to-b from-[#0A0C0C] to-[#081512] opacity-70 bg-blend-lighten blur-lg xl:opacity-100 xl:blur-0'
        )}
        style={background ? actionModuleBackground[background] : undefined}
      />
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
  tooltip: ReactNode;
  children: ReactNode;
}) => (
  <>
    <div className="flex flex-row flex-wrap items-center justify-between">
      <span className="inline-flex items-center gap-2 text-nowrap align-middle">
        {label}
        <ActionModuleTooltip>{tooltip}</ActionModuleTooltip>
      </span>
      <div>{children}</div>
    </div>
    <ActionModuleDivider />
  </>
);

export const ActionModuleRowSkeleton = () => (
  <>
    <div className="flex flex-row flex-wrap items-center justify-between">
      <Skeleton className="h-5 w-full max-w-32" />
      <Skeleton className="h-5 w-full max-w-48" />
    </div>
    <ActionModuleDivider />
  </>
);

export const ActionModuleDivider = () => <div className="bg-gray-dark h-px w-full" />;

export const ActionModulePage = ({ children, ...props }: ActionModuleProps) => (
  <ActionModule background={1} noHeader {...props}>
    <div className="flex h-full w-full flex-col text-lg md:py-40">
      <ModuleGridInfoContent className="w-full xl:w-3/4">{children}</ModuleGridInfoContent>
    </div>
  </ActionModule>
);
