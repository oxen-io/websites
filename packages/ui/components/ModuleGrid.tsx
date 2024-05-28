import { Loading } from './loading';
import { cn } from '../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

const moduleGridVariants = cva('module-grid h-max', {
  variants: {
    variant: {
      default: 'grid',
      section:
        'from-[#0A0C0C] to-[#081512] bg-gradient-to-b bg-blend-lighten shadow-md border-[2px] rounded-[40px] border-[#54797241] flex flex-col',
    },
    size: {
      default: 'gap-4 grid-cols-1 sm:grid-cols-2',
      lg: 'gap-8 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1',
    },
    colSpan: {
      default: 'xl:col-span-1 col-span-1',
      2: 'xl:col-span-2 col-span-1',
      3: 'xl:col-span-3 col-span-2',
      4: 'xl:col-span-4 col-span-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
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
        className={cn(moduleGridVariants({ variant, size, colSpan, className }))}
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
    <h2 ref={ref} className={cn('font-normal leading-none tracking-tight', className)} {...props} />
  )
);
ModuleGridTitle.displayName = 'ModuleGridTitle';

const ModuleGridHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-8 pb-0 justify-between flex flex-row w-full items-center', className)}
      {...props}
    />
  )
);
ModuleGridHeader.displayName = 'ModuleGridHeader';

const ModuleGridContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0 align-middle gap-2 flex flex-col', className)}
      {...props}
    />
  )
);
ModuleGridContent.displayName = 'ModuleGridContent';

export { ModuleGrid, ModuleGridContent, ModuleGridHeader, ModuleGridTitle, moduleGridVariants };
