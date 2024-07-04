'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@session/ui/ui/avatar';
import { Button } from '@session/ui/ui/button';
import { forwardRef } from 'react';
import { DiscordIcon } from '../icons/DiscordIcon';
import { signIn, signOut, useSession } from '../lib/client';
import { ButtonDataTestId } from '../testing/data-test-ids';

type DiscordAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  showAvatar?: boolean;
};

export const DiscordAuthButton = forwardRef<HTMLButtonElement, DiscordAuthButtonProps>(
  ({ showAvatar, ...props }, ref) => {
    const { data, status } = useSession();

    const isConnected = status === 'authenticated';
    const avatarSrc = data?.user?.image;
    const username = data?.user?.name;

    const handleClick = () => {
      if (!isConnected) {
        signIn('discord');
      } else {
        signOut();
      }
    };

    return (
      <Button
        onClick={handleClick}
        data-testid={ButtonDataTestId.DISCORD_AUTH}
        ref={ref}
        {...props}
        rounded="md"
        size="lg"
        className="text-session-black hover:text-session-black gap-2 border-transparent bg-[#5865F2] hover:bg-[#4853A4] hover:brightness-125"
      >
        <DiscordIcon className="h-5 w-5" />
        {isConnected ? (
          <div className={'inline-flex w-full items-center justify-evenly gap-1 overflow-x-hidden'}>
            {showAvatar ? (
              <Avatar className="h-6 w-6">
                {avatarSrc ? <AvatarImage src={avatarSrc} alt="Discord Avatar" /> : null}
                <AvatarFallback className="bg-session-black" />
              </Avatar>
            ) : null}
            {username ?? 'Connected'}
          </div>
        ) : (
          'Connect Discord'
        )}
      </Button>
    );
  }
);
