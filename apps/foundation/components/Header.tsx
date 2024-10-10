import Image from 'next/image';
import Link from 'next/link';
import { NavLink, type NavLinkProps } from '@session/ui/components/NavLink';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@session/ui/lib/utils';
import { HamburgerIcon } from '@session/ui/icons/HamburgerIcon';
import { XIcon } from '@session/ui/icons/XIcon';
import type { SiteSchemaType } from '@session/sanity-cms/schemas/site';
import { resolveAmbiguousLink } from '@session/sanity-cms/schemas/fields/basic/links';
import { SANITY_SCHEMA_URL } from '@/lib/constants';
import { client } from '@/lib/sanity/sanity.client';
import { safeTry } from '@session/util-js/try';
import logger from '@/lib/logger';
import { getTranslations } from 'next-intl/server';
import RouterResetInput from '@/components/RouterResetInput';

type HeaderProps = {
  headerLinks?: SiteSchemaType['headerLinks'];
};

export default async function Header({ headerLinks }: HeaderProps) {
  const dictionary = await getTranslations('header');
  const routes: Array<NavLinkProps> = [];

  if (headerLinks) {
    const [err, resolvedLinks] = await safeTry(
      Promise.all(
        headerLinks.map((link) => resolveAmbiguousLink(client, link, SANITY_SCHEMA_URL.POST))
      )
    );

    if (err) {
      logger.error(err);
    } else {
      resolvedLinks.forEach(({ href, label }) => {
        if (href && label) {
          routes.push({ href, label });
        } else {
          logger.warn(`Header link is missing href (${href}) or label (${label})`);
        }
      });
    }
  }

  return (
    <nav className="z-30 flex touch-none flex-wrap items-center justify-between pb-2 pt-6 md:touch-auto md:pb-6">
      <div className="flex flex-row items-center gap-10 pe-4 ps-6">
        <Link href="/" prefetch>
          <Image src="/images/logo.svg" alt="Session Foundation Logo" width={100} height={40} />
        </Link>
        <div className="text-session-text-black-secondary hidden h-max flex-row gap-10 md:flex">
          {routes.map(({ href, label }) => (
            <NavLink key={`header-desktop-${href}`} href={href} label={label} />
          ))}
        </div>
      </div>
      <RouterResetInput id="mobile-menu-toggle" className="peer hidden appearance-none" />
      <ToggleMobileMenuButton
        htmlFor="mobile-menu-toggle"
        ariaLabel={dictionary('mobileMenuButtonOpen')}
        className="me-4 block justify-end transition-all peer-checked:hidden md:hidden"
      >
        <HamburgerIcon className="stroke-[3]" />
      </ToggleMobileMenuButton>
      <ToggleMobileMenuButton
        htmlFor="mobile-menu-toggle"
        ariaLabel={dictionary('mobileMenuButtonClose')}
        className="animate-out me-4 hidden justify-end p-2 transition-all duration-300 ease-in-out peer-checked:block peer-checked:rotate-90 motion-reduce:animate-none md:hidden peer-checked:md:hidden"
      >
        <XIcon className="h-full w-full" />
      </ToggleMobileMenuButton>
      <div
        className={cn(
          'flex w-screen flex-col items-center gap-8 text-lg',
          'h-dvh max-h-0 select-none overflow-y-hidden transition-all duration-300 ease-in-out peer-checked:mt-[10vh] peer-checked:max-h-dvh peer-checked:touch-none peer-checked:select-auto motion-reduce:transition-none md:peer-checked:mt-0 md:peer-checked:max-h-0'
        )}
      >
        {routes.map(({ href, label }) => (
          <NavLink key={`header-mobile-${href}`} href={href} label={label} />
        ))}
      </div>
    </nav>
  );
}

type ToggleMobileMenuButtonProps = HTMLAttributes<HTMLLabelElement> & {
  htmlFor: string;
  ariaLabel: string;
};

const ToggleMobileMenuButton = forwardRef<HTMLLabelElement, ToggleMobileMenuButtonProps>(
  ({ ariaLabel, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        role="button"
        data-testid={ButtonDataTestId.Dropdown_Hamburger_Menu}
        aria-label={ariaLabel}
        className={cn(
          'flex h-12 w-12 cursor-pointer select-none items-center align-middle [stroke-linecap:round]',
          className
        )}
        {...props}
      />
    );
  }
);
