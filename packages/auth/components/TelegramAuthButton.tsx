'use client';

import { Button } from '@session/ui/ui/button';
import { LoginButton } from '@telegram-auth/react';
import { forwardRef, useRef } from 'react';
import { TelegramIcon } from '../icons/TelegramIcon';
import { signIn, signOut, useSession } from '../lib/client';
import { ButtonDataTestId } from '../testing/data-test-ids';

type TelegramAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  csrfToken: string;
};

export const TelegramAuthButton = forwardRef<HTMLButtonElement, TelegramAuthButtonProps>(
  ({ csrfToken, ...props }, ref) => {
    const { data, status } = useSession();
    const buttonContainerRef = useRef<HTMLDivElement>(null);

    const isConnected = status === 'authenticated';
    const username = data?.user?.name;

    console.log(data);

    const handleButtonClick = () => {
      const button = buttonContainerRef.current?.querySelector('button');
      button?.click();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (data: any) => {
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
          <LoginButton botUsername="session_testnet_bot" onAuthCallback={handleClick} />
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
