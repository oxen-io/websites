import { ROUTES } from '@/lib/constants';
import { cn } from '@session/ui/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { WalletModalButtonWithLocales } from './WalletModalButtonWithLocales';
import { WalletNetworkDropdownWithLocales } from './WalletNetworkDropdownWithLocales';
import { NavLink } from '@/components/NavLink';
import { DropdownHamburgerMenu } from '@/components/DropdownHamburgerMenu';
import { getTranslations } from 'next-intl/server';

export default async function Header() {
  const dictionary = await getTranslations('navigation');
  return (
    <nav className="z-30 flex items-center justify-between p-6">
      <div className={cn('flex flex-row gap-10 pr-4')}>
        <Link href="/">
          <Image src="/images/logo.png" alt="Session Token Logo" width={144} height={50} />
        </Link>
        <div className="hidden flex-row gap-10 lg:flex">
          {ROUTES.map(({ dictionaryKey, href }) => (
            <NavLink key={href} href={href} label={dictionary(dictionaryKey)} />
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <WalletModalButtonWithLocales />
        <WalletNetworkDropdownWithLocales className="hidden lg:flex" />
        <DropdownHamburgerMenu />
      </div>
    </nav>
  );
}
