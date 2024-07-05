'use client';

import { ROUTES } from '@/lib/constants';
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
    <nav className="flex items-center justify-between p-6">
      <div className={cn('flex max-w-28 flex-row gap-10', 'sm:max-w-none')}>
        <Link href="/">
          <Image src="/images/logo.png" alt="Session Token Logo" width={150} height={150} />
        </Link>
        <div className="hidden flex-row gap-10 md:flex">
          {ROUTES.map(({ dictionaryKey, href }) => (
            <NavLink key={href} href={href} label={dictionary(dictionaryKey)} pathname={pathname} />
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-2">
        <WalletModalButtonWithLocales
          className={cn('max-w-28 text-xs', 'sm:max-w-none', 'md:text-sm')}
        />
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
          className="px-0.25 group py-0"
          aria-label={dictionary('ariaLabel')}
          variant="outline"
        >
          <HamburgerIcon className="stroke-session-green group-hover:stroke-session-black h-9 w-9" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        <DropdownMenuItem
          onClick={() => console.log('lang')}
          aria-label={dictionary('ariaLanguage')}
        >
          {dictionary('language')}
        </DropdownMenuItem>
        {ROUTES.map(({ dictionaryKey, href }) => (
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
