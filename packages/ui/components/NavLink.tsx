'use client';

import Link from 'next/link';
import { cn } from '../lib/utils';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

/** TODO: This was copied from the staking portal, investigate if we can turn it into a shared library */

export type NavLinkProps = {
  href: string;
  label?: string;
  children?: ReactNode;
  ariaLabel?: string;
  className?: string;
  unstyled?: boolean;
};

/**
 * Returns true of a href is to an external link
 * @param href the link
 */
export function isExternalLink(href: string): boolean {
  if (href.startsWith('http://')) {
    throw new Error(`http links are forbidden, use https. Link: ${href}`);
  }
  return href.startsWith('https://');
}

export function NavLink({ href, label, children, ariaLabel, unstyled }: NavLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={
        !unstyled
          ? cn(
              'hover:text-session-text-black hover:border-b-session-green border-b-2 border-b-transparent',
              pathname.startsWith(href) && 'text-session-text-blackborder-b-session-green'
            )
          : undefined
      }
      aria-label={ariaLabel}
      {...(isExternalLink(href)
        ? {
            target: '_blank',
            referrerPolicy: 'no-referrer',
          }
        : {})}
    >
      {children ?? label}
    </Link>
  );
}
