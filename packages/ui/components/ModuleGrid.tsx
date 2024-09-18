import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Loading } from './loading';

const moduleGridVariants = cva('module-grid', {
  variants: {
    variant: {
      grid: 'grid auto-rows-min',
      section:
        'from-[#0A0C0C] to-[#081512] bg-gradient-to-b bg-blend-lighten shadow-md border-[2px] rounded-3xl border-[#54797241] flex flex-col',
      action:
        'shadow-md border-[2px] rounded-3xl border-[#668C83] border-opacity-80 flex flex-col overflow-hidden',
    },
    size: {
      md: 'gap-2 md:gap-4 grid-cols-1 sm:grid-cols-2',
      lg: 'lg:gap-8 xl:grid-cols-3 grid-cols-1',
    },
    colSpan: {
      1: 'xl:col-span-1 col-span-1',
      2: 'xl:col-span-2 col-span-1',
      3: 'xl:col-span-3 col-span-2',
      4: 'xl:col-span-4 col-span-2',
    },
  },
  defaultVariants: {
    variant: 'grid',
    size: 'md',
    colSpan: 1,
  },
});

export interface ModuleGridProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof moduleGridVariants> {
  loading?: boolean;
}

const ModuleGrid = forwardRef<HTMLDivElement, ModuleGridProps>(
  ({ className, variant, size, colSpan, loading, children, ...props }, ref) => {
    return (
      <div
        className={cn('relative', moduleGridVariants({ variant, size, colSpan, className }))}
        ref={ref}
        {...props}
      >
        {loading ? <Loading /> : children}
      </div>
    );
  }
);

ModuleGrid.displayName = 'ModuleGrid';

const ModuleGridTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'mx-4 my-2 text-lg font-medium leading-none tracking-tight md:block md:text-3xl',
        className
      )}
      {...props}
    />
  )
);
ModuleGridTitle.displayName = 'ModuleGridTitle';

type ModuleGridHeaderProps = HTMLAttributes<HTMLDivElement> & {
  keepDesktopHeaderOnMobile?: boolean;
};

const ModuleGridHeader = forwardRef<HTMLDivElement, ModuleGridHeaderProps>(
  ({ className, keepDesktopHeaderOnMobile, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex w-full flex-row items-center justify-between px-4 pt-6',
        keepDesktopHeaderOnMobile ? 'relative top-0' : 'absolute -top-16 md:relative md:top-0',
        className
      )}
      {...props}
    />
  )
);
ModuleGridHeader.displayName = 'ModuleGridHeader';

const ModuleGridContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-2 p-2 align-middle md:p-8 md:pt-0', className)}
      {...props}
    />
  )
);
ModuleGridContent.displayName = 'ModuleGridContent';

function ModuleGridInfoContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ModuleGridContent
      className={cn(
        'text-session-text flex h-full w-1/2 flex-col items-center justify-center gap-6 self-center text-center text-xl',
        className
      )}
    >
      {children}
    </ModuleGridContent>
  );
}

export {
  ModuleGrid,
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridInfoContent,
  ModuleGridTitle,
  moduleGridVariants,
};
