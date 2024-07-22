'use client';

import Link from 'next/link';
import { cn } from '@session/ui/lib/utils';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export type NavLinkProps = {
  href: string;
  label?: string;
  children?: ReactNode;
  ariaLabel?: string;
  className?: string;
};

/**
 * Returns true of a href is to an external link
 * @param href the link
 */
function isExternalLink(href: string): boolean {
  if (href.startsWith('http://')) {
    throw new Error(`http links are forbidden, use https. Link: ${href}`);
  }
  return href.startsWith('https://');
}

export function NavLink({ href, label, children, ariaLabel }: NavLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn('hover:text-session-green', pathname.startsWith(href) && 'text-session-green')}
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
