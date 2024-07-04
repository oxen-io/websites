import { AuthDataValidator } from '@telegram-auth/server';
import { objectToAuthDataMap } from '@telegram-auth/server/utils';
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
    async authorize(credentials, req) {
      const validator = new AuthDataValidator({ botToken });

      const data = objectToAuthDataMap(req.query || {});

      const user = await validator.validate(data);

      if (user.id && user.first_name) {
        return {
          id: user.id.toString(),
          name: [user.first_name, user.last_name || ''].join(' '),
          image: user.photo_url,
        };
      }

      return null;
    },
  });
