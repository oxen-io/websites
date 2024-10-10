import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { cva } from 'class-variance-authority';
export type { VariantProps } from 'class-variance-authority';

/**
 * Combines multiple class names into a single string.
 *
 * @param inputs - The class names to combine.
 * @returns The combined class names as a string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
