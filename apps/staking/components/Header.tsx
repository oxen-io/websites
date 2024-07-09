'use client';

import { EXTERNAL_ROUTES, ROUTES } from '@/lib/constants';
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
      <div className={cn('flex flex-row gap-10 pr-4')}>
        <Link href="/">
          <Image src="/images/logo.png" alt="Session Token Logo" width={150} height={150} />
        </Link>
        <div className="hidden flex-row gap-10 lg:flex">
          {ROUTES.map(({ dictionaryKey, href }) => (
            <NavLink key={href} href={href} label={dictionary(dictionaryKey)} pathname={pathname} />
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <WalletModalButtonWithLocales />
        {isConnected ? <WalletNetworkDropdownWithLocales className="hidden lg:flex" /> : null}
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
          <HamburgerIcon className="stroke-session-green group-hover:stroke-session-black h-9 w-9" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        {ROUTES.map(({ dictionaryKey, href }) => (
          <DropdownMenuItemNavLink
            key={href}
            href={href}
            label={navDictionary(dictionaryKey)}
            pathname={pathname}
            className="block lg:hidden"
          />
        ))}
        {EXTERNAL_ROUTES.map(({ dictionaryKey, href }) => (
          <DropdownMenuItemNavLink
            key={href}
            href={href}
            label={navDictionary(dictionaryKey)}
            pathname={pathname}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
