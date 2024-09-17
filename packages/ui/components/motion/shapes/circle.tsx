import {
  AnimationControls,
  motion,
  type MotionStyle,
  TargetAndTransition,
  VariantLabels,
  Variants,
} from 'framer-motion';
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const circleVariants = cva('', {
  variants: {
    variant: {
      black: 'fill-indicator-black',
      grey: 'fill-indicator-grey',
      green: 'fill-indicator-green',
      blue: 'fill-indicator-blue',
      yellow: 'fill-indicator-yellow',
      red: 'fill-indicator-red',
    },
    strokeVariant: {
      black: 'stroke-indicator-black',
      grey: 'stroke-indicator-grey',
      green: 'stroke-indicator-green',
      blue: 'stroke-indicator-blue',
      yellow: 'stroke-indicator-yellow',
      red: 'stroke-indicator-red',
    },
    glow: {
      black: '',
      grey: 'drop-shadow-[0_0_8px_var(--indicator-grey)] glow-grey',
      green: 'drop-shadow-[0_0_8px_var(--indicator-green)] glow',
      blue: 'drop-shadow-[0_0_8px_var(--indicator-blue)] glow-blue',
      yellow: 'drop-shadow-[0_0_8px_var(--indicator-yellow)] glow-yellow',
      red: 'drop-shadow-[0_0_8px_var(--indicator-red)] glow-red',
    },
    partial: {
      '100': '',
      '25': '[stroke-dasharray:25,100] [stroke-linecap:round]',
    },
  },
  defaultVariants: {
    variant: 'black',
    strokeVariant: 'black',
    glow: 'black',
    partial: '100',
  },
});

type CircleVariantProps = VariantProps<typeof circleVariants>;

type CircleProps = CircleVariantProps & {
  cx: number | string;
  cy: number | string;
  r: number;
  strokeWidth?: number;
  className?: string;
  variants?: Variants;
  animate?: AnimationControls | TargetAndTransition | VariantLabels;
  style?: MotionStyle;
};

export const Circle = forwardRef<SVGCircleElement, CircleProps>(
  (
    {
      cx,
      cy,
      r,
      strokeWidth,
      className,
      style,
      variant,
      strokeVariant,
      partial,
      glow,
      animate,
      variants,
      ...props
    },
    ref
  ) => (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      strokeWidth={strokeWidth}
      className={cn(circleVariants({ variant, strokeVariant, partial, glow, className }))}
      style={style}
      ref={ref}
      variants={variants}
      animate={animate}
      {...props}
    />
  )
);
