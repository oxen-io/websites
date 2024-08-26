'use client';

import Link from 'next/link';
import { BASE_URL, SOCIALS, URL } from '@/lib/constants';
import { Social } from '@session/ui/components/SocialLinkList';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useAddSessionTokenToWallet } from '@session/wallet/hooks/wallet-hooks';

export function NewTokenContractInfo() {
  const dictionary = useTranslations('banner');
  const { addToken } = useAddSessionTokenToWallet(`${BASE_URL}/images/token_logo.svg`);
  return (
    <span>
      {dictionary.rich('newTokenContract', {
        'remove-token-link': (children: ReactNode) => (
          <Link
            className="font-medium underline"
            href={URL.REMOVE_TOKEN_FROM_WATCH_LIST}
            referrerPolicy="no-referrer"
            target="_blank"
          >
            {children}
          </Link>
        ),
        'watch-token': (children: ReactNode) => (
          <a
            className="cursor-pointer font-medium underline"
            onClick={addToken}
            referrerPolicy="no-referrer"
            target="_blank"
          >
            {children}
          </a>
        ),
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
