'use client';

import Link from 'next/link';
import { SOCIALS } from '@/lib/constants';
import { Social } from '@session/ui/components/SocialLinkList';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

export function RegistrationPausedInfo() {
  const dictionary =  useTranslations('banner')
  return (
    <span>
      {dictionary.rich('registrationPaused', {link: (children:ReactNode) => <Link className='underline' href={SOCIALS[Social.Discord].link} referrerPolicy="no-referrer" target="_blank">
          {children}
        </Link>})}
    </span>
  );
}
