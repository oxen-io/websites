'use client';
import type { LocaleKey } from '@/lib/locale-util';
import { cn } from '@session/ui/lib/utils';
import ConnectButton from '@session/wallet/components/ConnectButton';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinkItem = {
  href: string;
  dictionaryKey: keyof LocaleKey['navigation'];
};

const links: LinkItem[] = [
  { dictionaryKey: 'stake', href: '/stake' },
  { dictionaryKey: 'myStakes', href: '/mystakes' },
] as const;

type NavLinkProps = {
  href: string;
  pathname: string;
  label: string;
};

function NavLink({ href, label, pathname }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn('hover:text-green', pathname.startsWith(href) && 'text-session-green')}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const dictionary = useTranslations('navigation');
  const walletDictionary = useTranslations('wallet');
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-between flex-wrap p-6">
      <div className="flex flex-row gap-10">
        <Link href="/">
          <Image src="/images/logo.png" alt="Session Token Logo" width={150} height={150} />
        </Link>
        <div className="hidden md:flex flex-row gap-10">
          {links.map(({ dictionaryKey, href }) => (
            <NavLink key={href} href={href} label={dictionary(dictionaryKey)} pathname={pathname} />
          ))}
        </div>
      </div>
      <ConnectButton
        labels={{
          disconnected: walletDictionary('connect'),
          connected: walletDictionary('disconnect'),
          connecting: walletDictionary('connecting'),
          reconnecting: walletDictionary('reconnecting'),
        }}
      />
    </nav>
  );
}
