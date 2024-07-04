'use client';
import { NextAuthProvider } from '@session/auth/client';
import { DiscordAuthButton } from '@session/auth/components/DiscordAuthButton';
import { TelegramAuthButton } from '@session/auth/components/TelegramAuthButton';
import { AuthModule } from './AuthModule';

export default function FaucetPage() {
  return (
    <NextAuthProvider>
      <div className="flex justify-center p-4 align-middle">
        <AuthModule />
        <DiscordAuthButton />
        <TelegramAuthButton />
      </div>
    </NextAuthProvider>
  );
}
