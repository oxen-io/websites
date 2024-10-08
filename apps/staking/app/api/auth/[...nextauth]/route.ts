import { createAuthHandler } from '@session/auth/api';
import { DiscordProvider, handleDiscordSession } from '@session/auth/providers/discord';
import { handleTelegramSession, TelegramProvider } from '@session/auth/providers/telegram';
import { NextAuthJWT, NextAuthSession } from '@session/auth/types';

const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

if (!discordClientId || !discordClientSecret) {
  throw new Error('Discord client ID and client secret must be provided');
}

if (!telegramBotToken) {
  throw new Error('Telegram bot token must be provided');
}

export const { GET, POST } = createAuthHandler({
  providers: [
    DiscordProvider({
      clientId: discordClientId,
      clientSecret: discordClientSecret,
    }),
    TelegramProvider({ botToken: telegramBotToken }),
  ],
  callbacks: {
    async session({ session, token }: { session: NextAuthSession; token: NextAuthJWT }) {
      handleDiscordSession({ session, token });
      handleTelegramSession({ session, token });
      return session;
    },
  },
});
