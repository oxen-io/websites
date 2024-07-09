'use client';
import { NextAuthProvider } from '@session/auth/client';

import { COMMUNITY_DATE } from '@/lib/constants';
import { formatDate, formatList } from '@/lib/locale-client';
import { useTranslations } from 'next-intl';
import { AuthModule } from './AuthModule';

export default function FaucetPage() {
  const dictionary = useTranslations('faucet.information');
  return (
    <NextAuthProvider>
      <div className="lg:-mt-header-displacement max-w-screen-3xl mx-auto flex w-screen flex-col items-center justify-around gap-16 px-12 py-16 align-middle lg:grid lg:h-dvh lg:grid-cols-2 lg:p-32 lg:py-0">
        <div className="flex max-h-[500px] flex-col gap-4 text-start">
          <h1 className="text-5xl font-semibold">{dictionary('title')}</h1>
          <h2 className="text-lg font-semibold">{dictionary('communityTitle')}</h2>
          <p>
            {dictionary.rich('communityDescription', {
              connectionOptions: formatList(['Discord', 'Telegram']),
              snapshotDate: formatDate(new Date(COMMUNITY_DATE.SESSION_TOKEN_COMMUNITY_SNAPSHOT), {
                dateStyle: 'long',
              }),
            })}
          </p>
          <h2 className="text-lg font-semibold">{dictionary('oxenTitle')}</h2>
          <p>
            {dictionary.rich('oxenDescription', {
              oxenRegistrationDate: formatDate(
                new Date(COMMUNITY_DATE.OXEN_SERVICE_NODE_BONUS_PROGRAM),
                {
                  dateStyle: 'long',
                }
              ),
            })}
          </p>
          <p>{dictionary('notEligible')}</p>
          <h2 className="text-lg font-semibold">{dictionary('walletRequirementTitle')}</h2>
          <p>{dictionary.rich('walletRequirementDescription')}</p>
        </div>
        <div className="h-full max-h-[500px]">
          <AuthModule />
        </div>
      </div>
    </NextAuthProvider>
  );
}
