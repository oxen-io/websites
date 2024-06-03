import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

type SpaceIdResponseBody =
  | {
      code: 0;
      name: string | null;
    }
  | {
      code: 1;
      msg: string;
    };

/**
 * Retrieves the .arb name associated with the given address.
 * @param address The address to reverse lookup the .arb name of.
 * @returns A Promise that resolves to the .arb name, or null if the request fails.
 */
async function getArbName(address: Address): Promise<string | null> {
  const res = await fetch(`https://api.prd.space.id/v1/getName?tld=arb1&address=${address}`);

  if (!res.ok) {
    console.log('Failed to fetch arb name:', res.statusText);
    return null;
  }

  const body = (await res.json()) as SpaceIdResponseBody;

  if (body.code === 0) {
    return body.name;
  } else {
    console.log('Failed to fetch arb name:', body.msg);
    return null;
  }
}

export function useArbName({ address }: { address?: Address }): { arbName?: string | null } {
  const { data: arbName } = useQuery({
    enabled: !!address,
    queryKey: ['arbName', address],
    queryFn: async () => {
      return getArbName(address!);
    },
  });

  return { arbName };
}
