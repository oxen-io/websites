import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { BaseDataTestId, TestingProps } from '../../data-test-ids';
import { cn } from '../../lib/utils';
import { Skeleton } from './skeleton';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-session-green text-session-black hover:bg-session-black hover:text-session-green border border-session-green',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-session-green text-session-green bg-background hover:bg-session-green hover:text-session-black disabled:border-gray-lightest disabled:text-gray-lightest disabled:opacity-100',
        'destructive-outline':
          'border border-destructive text-destructive bg-background hover:bg-destructive hover:text-destructive-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        'destructive-ghost':
          'text-destructive hover:bg-destructive hover:text-destructive-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-9 px-3 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
      rounded: {
        full: 'rounded-full',
        lg: 'rounded-lg',
        md: 'rounded-md',
        sm: 'rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'full',
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps,
    TestingProps<BaseDataTestId.Button> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
        data-testid={props['data-testid'] ?? BaseDataTestId.Button}
      />
    );
  }
);
Button.displayName = 'Button';

type ButtonSkeletonProps = ButtonVariantProps & { className?: string };

const ButtonSkeleton = ({ className, variant, size, rounded }: ButtonSkeletonProps) => {
  return (
    <Skeleton className={cn(buttonVariants({ className, variant, size, rounded }), 'grayscale')} />
  );
};

export { Button, ButtonSkeleton, buttonVariants };
