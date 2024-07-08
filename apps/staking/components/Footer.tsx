import { FOOTER_LINKS, SOCIALS } from '@/lib/constants';
import { Footer as FooterComp } from '@session/ui/components/Footer';
import { cn } from '@session/ui/lib/utils';

import { useTranslations } from 'next-intl';
export function Footer() {
  const dictionary = useTranslations('navigation');

  const menuItems = FOOTER_LINKS.map(({ dictionaryKey, href, linkType = 'internal' }) => ({
    title: dictionary(dictionaryKey),
    href: href,
    linkType,
  }));

  const socialLinks = Object.values(SOCIALS);

  return (
    <FooterComp
      logo={{ src: '/images/logo.png', alt: 'Session Token Logo' }}
      menuItems={menuItems}
      socialLinks={socialLinks}
      footerManagedBy={dictionary('managedBy')}
      className={cn('max-w-screen-3xl my-16 w-full px-8')}
    />
  );
}
