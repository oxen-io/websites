'use client';

import { LoginButton } from '@telegram-auth/react';
import { forwardRef } from 'react';
import { signIn, signOut, useSession } from '../lib/client';

type TelegramAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  csrfToken: string;
};

export const TelegramAuthButton = forwardRef<HTMLButtonElement, TelegramAuthButtonProps>(
  ({ csrfToken, ...props }, ref) => {
    const { data, status } = useSession();

    const isConnected = status === 'authenticated';

    console.log(data);

    const handleClick = (data: any) => {
      if (!isConnected) {
        signIn('telegram', { callbackUrl: '/faucet' }, data);
      } else {
        signOut();
      }
    };

    return (
      <>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <LoginButton botUsername="session_testnet_bot" onAuthCallback={handleClick} />
      </>
    );
  }
);
{
  /* <Button
        onClick={handleClick}
        data-testid={ButtonDataTestId.DISCORD_AUTH}
        ref={ref}
        {...props}
      >
        <TelegramIcon className="h-4 w-4" />
        {isConnected ? username ?? 'Connected' : 'Connect Discord'}
      </Button> */
}
