import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/utils';
import { Loading } from './loading';

export const outerModuleVariants = cva(
  'rounded-[40px] transition-all ease-in-out bg-gradient-to-br from-[#7FB1AE] to-[#2A4337] bg-blend-lighten shadow-md p-px',
  {
    variants: {
      variant: {
        default: '',
        hero: '',
      },
      size: {
        default: 'col-span-1',
        lg: 'col-span-1 sm:col-span-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const innerModuleVariants = cva(
  'rounded-[40px] w-full h-full flex align-middle flex-col [&>span]:font-normal [&>*>span]:font-normal from-[#0a0a0a] to-[#081B14] bg-gradient-to-br',
  {
    variants: {
      variant: {
        default:
          '[&>h3]:text-lg [&>*>h3]:text-lg [&>span]:text-3xl [&>*>span]:text-3xl [&>h3]:font-light [&>*>h3]:font-light bg-blend-lighten shadow-md gap-1',
        hero: '[&>h3]:text-3xl [&>h3]:font-regular [&>span]:text-8xl [&>*>h3]:text-2xl [&>*>h3]:font-regular [&>*>span]:text-7xl gap-4 hover:brightness-125',
      },
      size: {
        default: 'p-8',
        lg: 'p-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ModuleProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof innerModuleVariants> {
  loading?: boolean;
  noPadding?: boolean;
}

const Module = forwardRef<HTMLDivElement, ModuleProps>(
  ({ className, variant, size, loading, children, noPadding, ...props }, ref) => {
    return (
      <div className={cn(outerModuleVariants({ size, variant, className }))}>
        <div
          className={cn(
            innerModuleVariants({ size, variant, className }),
            noPadding && 'p-0',
            props.onClick && 'hover:bg-session-green hover:text-session-black hover:cursor-pointer'
          )}
          ref={ref}
          {...props}
          style={
            variant === 'hero'
              ? {
                  background: 'url(/images/module-hero.png)',
                  backgroundPositionX: '35%',
                  backgroundPositionY: '43%',
                  backgroundSize: '150%',
                }
              : undefined
          }
        >
          {loading ? <Loading /> : children}
        </div>
      </div>
    );
  }
);

Module.displayName = 'Module';

const moduleHeaderVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      overlay: 'absolute z-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ModuleHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof moduleHeaderVariants> {
  loading?: boolean;
}

const ModuleHeader = forwardRef<HTMLDivElement, ModuleHeaderProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <div className={cn(moduleHeaderVariants({ variant, className }))} ref={ref} {...props}>
        {loading ? <Loading /> : children}
      </div>
    );
  }
);
ModuleHeader.displayName = 'ModuleHeader';

const ModuleTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-atyp-display text-text-gradient leading-none tracking-tight', className)}
      {...props}
    />
  )
);
ModuleTitle.displayName = 'ModuleTitle';

const ModuleText = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('font-atyp-display text-text-gradient', className)} {...props} />
  )
);
ModuleText.displayName = 'ModuleText';

const ModuleDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-muted-foreground', className)} {...props} />
  )
);
ModuleDescription.displayName = 'ModuleDescription';

const moduleContentVariants = cva(
  'flex flex-col align-middle justify-center w-full h-full text-center items-center',
  {
    variants: {
      variant: {
        default: '',
        underlay: 'absolute inset-0 -z-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
export interface ModuleContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof moduleContentVariants> {
  loading?: boolean;
}
const ModuleContent = forwardRef<HTMLDivElement, ModuleContentProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <div className={cn(moduleContentVariants({ variant, className }))} ref={ref} {...props}>
        {loading ? <Loading /> : children}
      </div>
    );
  }
);

ModuleContent.displayName = 'ModuleContent';

export {
  Module,
  ModuleContent,
  ModuleDescription,
  ModuleHeader,
  ModuleText,
  ModuleTitle,
  innerModuleVariants as moduleVariants,
};
