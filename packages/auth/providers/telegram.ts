import { AuthDataValidator } from '@telegram-auth/server';
import { objectToAuthDataMap } from '@telegram-auth/server/utils';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

type TelegramProviderOptions = {
  botToken: string;
};

/**
 * TelegramProvider is a provider for authenticating users using Telegram.
 *
 * @param botToken - The Telegram bot token.
 * @returns A credentials provider for Telegram authentication.
 */
export const TelegramProvider = ({ botToken }: TelegramProviderOptions) =>
  CredentialsProvider({
    id: 'telegram',
    name: 'Telegram',
    credentials: {},
    /** @ts-expect-error -- trust me im right */
    async authorize(credentials, req) {
      const validator = new AuthDataValidator({ botToken });

      const data = objectToAuthDataMap(req.query || {});

      const user = await validator.validate(data);

      console.log('user', user);

      const obj = {
        id: user.id,
        name: user.first_name,
        email: user.username,
      };

      console.log('obj', obj);

      return obj;
    },
  });

export function handleTelegramSession({ session, token }: { session: Session; token: JWT }) {
  if (token.sub) {
    if (!token?.picture?.includes('discord')) {
      // @ts-expect-error -- Next auth doesnt properly return the user id, this fixes that
      session.user.telegramId = token.sub;
    }
  }
}
