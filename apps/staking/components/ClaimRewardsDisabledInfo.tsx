'use client';

import Link from 'next/link';
import { SOCIALS } from '@/lib/constants';
import { Social } from '@session/ui/components/SocialLinkList';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

export function ClaimRewardsDisabledInfo() {
  const dictionary = useTranslations('banner');
  return (
    <span>
      {dictionary.rich('claimRewardsDisabled', {
        link: (children: ReactNode) => (
          <Link
            className="font-medium underline"
            href={SOCIALS[Social.Discord].link}
            referrerPolicy="no-referrer"
            target="_blank"
          >
            {children}
          </Link>
        ),
      })}
    </span>
  );
}
