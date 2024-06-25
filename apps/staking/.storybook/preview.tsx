import {
  createStorybookDecoratorsFromDefault,
  createStorybookPreviewFromDefault,
} from '@session/storybook/lib/utils';
import '@session/ui/styles';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  navigation: {
    home: 'Home',
    stake: 'Stake Now',
    myStakes: 'My Stakes',
    docs: 'Docs',
    support: 'Support',
  },
  wallet: {
    connect: 'Connect Wallet',
    connecting: 'Connecting Wallet...',
    reconnecting: 'Reconnecting Wallet...',
    disconnect: 'Disconnect Wallet',
    balance: 'Balance',
    address: 'Address',
  },
  notFound: {
    description: "Sorry! We couldn't find the page you were looking for.",
    homeButton: 'Return Home',
  },
  home: {
    title: 'Stake <bold>{token}</bold> Earn Rewards',
    buttons: {
      primary: 'STAKE NOW',
      secondary: 'HOW TO RUN A SESSION NODE',
    },
  },
  myStakes: {
    title: 'My Stakes',
  },
  modules: {
    buttons: {
      refetch: 'Refetch',
    },
    balance: {
      title: 'Total $SENT:',
      description: 'Total $SENT in your wallet.',
      error: 'Failed to fetch balance.',
      refetching: 'Refetching balance...',
      refetchSuccess: 'Successfully refetched balance',
    },
    dailyRewards: {
      title: 'Daily Node Rewards:',
      description: 'Current daily rewards per node.',
      error: 'Failed to fetch daily rewards.',
      refetching: 'Refetching daily rewards...',
      refetchSuccess: 'Successfully refetched daily rewards',
    },
    totalRewards: {
      title: 'Total Rewards Earned:',
      description: 'Total rewards earned from staking.',
      error: 'Failed to fetch total rewards.',
      refetching: 'Refetching total rewards...',
      refetchSuccess: 'Successfully refetched total rewards',
    },
    unclaimedTokens: {
      title: 'Unclaimed Tokens:',
      description: 'Total rewards that have not been claimed.',
      error: 'Failed to fetch unclaimed tokens.',
      refetching: 'Refetching unclaimed tokens...',
      refetchSuccess: 'Successfully refetched unclaimed tokens',
    },
    claim: {
      title: 'Claim',
      description: 'Claim your rewards from staking.',
      error: 'Failed to claim rewards.',
    },
    price: {
      title: 'Price:',
      description: 'Current price of $SENT.',
    },
  },
  nodeCard: {
    pubKey: {
      copyPubkeyToClipboard: 'Copy to Clipboard',
      copyPubkeyToClipboardSuccessToast: 'Copied Session Node Pubkey to clipboard!',
    },
  },
};

export const decorators = createStorybookDecoratorsFromDefault();

const preview = createStorybookPreviewFromDefault({
  decorators: [
    (Story) => {
      return (
        <NextIntlClientProvider messages={messages} locale={'en'}>
          <Story />
        </NextIntlClientProvider>
      );
    },
  ],
});

export default preview;
