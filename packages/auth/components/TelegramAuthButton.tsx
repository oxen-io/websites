'use client';

import { Button } from '@session/ui/ui/button';
import { LoginButton } from '@telegram-auth/react';
import { TelegramIcon } from 'icons/TelegramIcon';
import { forwardRef } from 'react';
import { ButtonDataTestId } from 'testing/data-test-ids';
import { signIn, signOut, useSession } from '../lib/client';

type TelegramAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  csrfToken: string;
};

export const TelegramAuthButton = forwardRef<HTMLButtonElement, TelegramAuthButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ csrfToken, ...props }, ref) => {
    const { data, status } = useSession();

    const isConnected = status === 'authenticated';
    const username = data?.user?.name;

    console.log(data);

    console.log('username', username);

    const handleButtonClick = () => {
      if (!isConnected) {
        /** @ts-expect-error -- Exists at runtime */
        return TWidgetLogin.auth();
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAuth = (data: any) => {
      if (!isConnected) {
        signIn('telegram', {}, data);
      } else {
        signOut();
      }
    };

    return (
      <>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="hidden">
          <LoginButton botUsername="session_testnet_bot" onAuthCallback={handleAuth} />
        </div>
        <Button
          onClick={handleButtonClick}
          data-testid={ButtonDataTestId.TELEGRAM_AUTH}
          ref={ref}
          {...props}
        >
          <TelegramIcon className="h-4 w-4" />
          {isConnected ? username ?? 'Connected' : 'Connect Telegram'}
        </Button>
      </>
    );
  }
);
