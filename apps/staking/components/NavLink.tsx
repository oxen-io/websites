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

export function NavLink({ href, label, children, ariaLabel }: NavLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn('hover:text-session-green', pathname.startsWith(href) && 'text-session-green')}
      aria-label={ariaLabel}
    >
      {children ?? label}
    </Link>
  );
}
