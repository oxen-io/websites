import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const typographyVariants = cva('text-sm md:text-base', {
  variants: {
    variant: {
      h1: 'text-3xl md:text-4xl font-semibold',
      h2: 'text-xl font-semibold md:text-3xl',
      h3: 'text-lg font-semibold md:text-xl',
      h4: 'text-base font-semibold md:text-lg',
      h5: 'text-base font-semibold md:text-lg',
      h6: 'font-semibold',
      li: 'list-disc',
      ol: 'list-decimal',
      ul: 'list-disc',
      strong: 'font-semibold',
      em: 'italic',
      p: '',
      span: '',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

export type TypographyVariantProps = VariantProps<typeof typographyVariants>;

export type TypographyProps = TypographyVariantProps & {
  children: ReactNode;
  className?: string;
};

export default function Typography({ variant, className, children }: TypographyProps) {
  const Comp = variant ?? 'p';
  return <Comp className={cn(typographyVariants({ variant, className }))}>{children}</Comp>;
}
