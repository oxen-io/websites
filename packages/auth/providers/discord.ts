import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import NextAuthDiscordProvider from 'next-auth/providers/discord';

type DiscordProviderOptions = {
  clientId: string;
  clientSecret: string;
};

/**
 * Creates a NextAuth provider for Discord authentication.
 *
 * @param clientId - The client ID for your Discord application.
 * @param clientSecret - The client secret for your Discord application.
 * @returns A NextAuth provider for Discord authentication.
 */
export const DiscordProvider = ({ clientId, clientSecret }: DiscordProviderOptions) =>
  NextAuthDiscordProvider({
    clientId,
    clientSecret,
    authorization: { params: { scope: 'identify' } },
  });

/**
 * Handles the Discord session by updating the session object with the Discord user ID. This is necessary because NextAuth does not properly return the user ID.
 *
 * @param options The options for handling the Discord session.
 * @param options.session The session object.
 * @param options.token The JWT token.
 * @returns The updated session object.
 *
 * @example
 * ```ts
 * callbacks: {
      async session({ session, token }) {
        handleDiscordSession({ session, token });
        return session;
      },
    },
 * ```
 */
export function handleDiscordSession({ session, token }: { session: Session; token: JWT }) {
  if (token) {
    if (token?.picture?.includes('discord')) {
      // @ts-expect-error -- Next auth doesnt properly return the user id, this fixes that
      session.user.discordId = token.sub;
    }
  }
}
