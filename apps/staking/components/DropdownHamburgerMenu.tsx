'use client';

import { NavLink, NavLinkProps } from '@/components/NavLink';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@session/ui/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { Button } from '@session/ui/ui/button';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { HamburgerIcon } from '@session/ui/icons/HamburgerIcon';
import { EXTERNAL_ROUTES, ROUTES } from '@/lib/constants';

function DropdownMenuItemNavLink({ label, children, ...props }: NavLinkProps) {
  return (
    <NavLink {...props}>
      <DropdownMenuItem className={props.className}>{children ?? label}</DropdownMenuItem>
    </NavLink>
  );
}

export function DropdownHamburgerMenu() {
  const dictionary = useTranslations('navigation.hamburgerDropdown');
  const navDictionary = useTranslations('navigation');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid={ButtonDataTestId.Dropdown_Hamburger_Menu}
          className="group p-1"
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
            className="block lg:hidden"
          />
        ))}
        {EXTERNAL_ROUTES.map(({ dictionaryKey, href }) => (
          <DropdownMenuItemNavLink key={href} href={href} label={navDictionary(dictionaryKey)} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
