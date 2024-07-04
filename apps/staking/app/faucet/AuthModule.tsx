import { useSession } from '@session/auth/client';

export const AuthModule = () => {
  const { data, status } = useSession();

  console.log(data);

  /** @ts-expect-error -- Workaround to get id */
  const discordId = data?.user?.discordId;

  return <pre>{discordId}</pre>;
};
