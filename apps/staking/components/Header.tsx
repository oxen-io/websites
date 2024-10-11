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
  const isCanary = process.env.NEXT_PUBLIC_IS_CANARY?.toLowerCase() === 'true';

  const routes: typeof ROUTES = [];
  ROUTES.forEach(({ dictionaryKey, href }) => {
    if (
      process.env.NEXT_PUBLIC_HIDE_FAUCET?.toLowerCase() === 'true' &&
      dictionaryKey === 'faucet'
    ) {
      return;
    }
    routes.push({ dictionaryKey, href });
  });

  return (
    <nav className="z-30 flex items-center justify-between p-6">
      <div className={cn('flex flex-row gap-10 pr-4')}>
        <Link href="/" className="relative">
          <Image src="/images/logo.png" alt="Session Token Logo" width={144} height={50} />
          {isCanary ? <span className="absolute -top-4 left-1 h-max w-max text-sm">🐤</span> : null}
        </Link>
        <div className="hidden flex-row gap-10 lg:flex">
          {routes.map(({ dictionaryKey, href }) => (
            <NavLink key={href} href={href} label={dictionary(dictionaryKey)} />
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center justify-end gap-3">
        <WalletModalButtonWithLocales />
        <WalletNetworkDropdownWithLocales className="hidden h-full px-5 py-3 lg:flex" />
        <DropdownHamburgerMenu />
      </div>
    </nav>
  );
}
