'use client';

import { Button } from '@session/ui/ui/button';
import { LoginButton } from '@telegram-auth/react';
import { forwardRef } from 'react';
import { TelegramIcon } from '../icons/TelegramIcon';
import { signIn, signOut, useSession } from '../lib/client';
import { ButtonDataTestId } from '../testing/data-test-ids';

type TelegramAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const TelegramAuthButton = forwardRef<HTMLButtonElement, TelegramAuthButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (props, ref) => {
    const { data, status } = useSession();

    const isConnected = status === 'authenticated';
    const username = data?.user?.name;

    console.log(data);

    console.log('username', username);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAuth = (data: any) => {
      if (!isConnected) {
        signIn('telegram', {}, data);
      } else {
        signOut();
      }
    };

    return (
      <div className="relative">
        <div className="absolute opacity-0">
          <LoginButton botUsername="session_testnet_bot" onAuthCallback={handleAuth} />
        </div>
        <Button
          data-testid={ButtonDataTestId.TELEGRAM_AUTH}
          ref={ref}
          {...props}
          rounded="md"
          size="lg"
          className="text-session-black hover:text-session-black gap-2 border-transparent bg-[#2AABEE] hover:bg-[#2AABEE] hover:brightness-125"
        >
          <TelegramIcon className="h-4 w-4" />
          {isConnected ? username ?? 'Connected' : 'Connect Telegram'}
        </Button>
      </div>
    );
  }
);
