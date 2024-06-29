'use client';

import type { LocaleKey } from '@/lib/locale-util';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { HamburgerIcon } from '@session/ui/icons/HamburgerIcon';
import { cn } from '@session/ui/lib/utils';
import { Button } from '@session/ui/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@session/ui/ui/dropdown-menu';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletModalButtonWithLocales } from './WalletModalButtonWithLocales';
import { WalletNetworkDropdownWithLocales } from './WalletNetworkDropdownWithLocales';

type LinkItem = {
  href: string;
  dictionaryKey: keyof Omit<LocaleKey['navigation'], 'hamburgerDropdown'>;
};

const links: LinkItem[] = [
  { dictionaryKey: 'stake', href: '/stake' },
  { dictionaryKey: 'myStakes', href: '/mystakes' },
] as const;

type NavLinkProps = {
  href: string;
  pathname: string;
  label?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
};

function NavLink({ href, label, pathname, children, ariaLabel }: NavLinkProps) {
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

export default function Header() {
  const { isConnected } = useWallet();
  const dictionary = useTranslations('navigation');
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center justify-between p-6">
      <div className="flex flex-row gap-10">
        <Link href="/">
          <Image src="/images/logo.png" alt="Session Token Logo" width={150} height={150} />
        </Link>
        <div className="hidden flex-row gap-10 md:flex">
          {links.map(({ dictionaryKey, href }) => (
            <NavLink key={href} href={href} label={dictionary(dictionaryKey)} pathname={pathname} />
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-2">
        <WalletModalButtonWithLocales />
        {isConnected ? <WalletNetworkDropdownWithLocales className="hidden md:flex" /> : null}
        <DropdownHamburgerMenu />
      </div>
    </nav>
  );
}

function DropdownMenuItemNavLink({ label, children, ...props }: NavLinkProps) {
  return (
    <NavLink {...props}>
      <DropdownMenuItem className={props.className}>{children ?? label}</DropdownMenuItem>
    </NavLink>
  );
}

function DropdownHamburgerMenu() {
  const pathname = usePathname();
  const dictionary = useTranslations('navigation.hamburgerDropdown');
  const navDictionary = useTranslations('navigation');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid={ButtonDataTestId.Dropdown_Hamburger_Menu}
          className="group p-0"
          aria-label={dictionary('ariaLabel')}
          variant="outline"
        >
          <HamburgerIcon className="stroke-session-green group-hover:stroke-session-black h-7 w-7" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        <DropdownMenuItem
          onClick={() => console.log('lang')}
          aria-label={dictionary('ariaLanguage')}
        >
          {dictionary('language')}
        </DropdownMenuItem>
        {links.map(({ dictionaryKey, href }) => (
          <DropdownMenuItemNavLink
            key={href}
            href={href}
            label={navDictionary(dictionaryKey)}
            pathname={pathname}
            className="block md:hidden"
          />
        ))}
        <DropdownMenuItemNavLink
          href="/support"
          ariaLabel={dictionary('ariaSupport')}
          pathname={pathname}
        >
          {dictionary('support')}
        </DropdownMenuItemNavLink>
        <DropdownMenuItemNavLink
          href="/faucet"
          ariaLabel={dictionary('ariaFaucet')}
          pathname={pathname}
        >
          {dictionary('faucet')}
        </DropdownMenuItemNavLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
