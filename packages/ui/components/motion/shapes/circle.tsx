import { motion, type MotionStyle, Variants } from 'framer-motion';
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const circleVariants = cva('', {
  variants: {
    variant: {
      black: 'fill-black',
      grey: 'fill-[#4A4A4A]',
      green: 'fill-[#00F782]',
      blue: 'fill-[#00A3F7]',
      yellow: 'fill-[#F7DE00]',
      red: 'fill-red-500',
    },
    strokeVariant: {
      black: 'stroke-black',
      grey: 'stroke-[#4A4A4A]',
      green: 'stroke-[#00F782]',
      blue: 'stroke-[#00A3F7]',
      yellow: 'stroke-[#F7DE00]',
      red: 'stroke-red-500',
    },
    glow: {
      black: '',
      grey: 'drop-shadow-[0_0_8px_#4A4A4A] glow-grey',
      green: 'drop-shadow-[0_0_8px_#00F782] glow',
      blue: 'drop-shadow-[0_0_8px_#00A3F7] glow-blue',
      yellow: 'drop-shadow-[0_0_8px_#F7DE00] glow-yellow',
      red: 'drop-shadow-[0_0_8px_F70000] glow-red',
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
  animate?: any;
  style?: MotionStyle;
};

export const Circle = forwardRef<SVGCircleElement, CircleProps>(
  (
    { cx, cy, r, strokeWidth, className, style, variant, strokeVariant, partial, glow, ...props },
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
      {...props}
    />
  )
);
