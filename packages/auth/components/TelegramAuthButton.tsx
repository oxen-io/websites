'use client';

import { LoginButton } from '@telegram-auth/react';
import { forwardRef } from 'react';
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
        {/* <div className="hidden"> */}
        <LoginButton botUsername="session_testnet_bot" onAuthCallback={handleClick} />
        {/* </div> */}
        {/* <Button
          onClick={handleButtonClick}
          data-testid={ButtonDataTestId.TELEGRAM_AUTH}
          ref={ref}
          {...props}
        >
          <TelegramIcon className="h-4 w-4" />
          {isConnected ? username ?? 'Connected' : 'Connect Telegram'}
        </Button> */}
      </>
    );
  }
);
