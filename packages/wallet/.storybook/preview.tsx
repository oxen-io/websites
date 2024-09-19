import type { Preview } from '@session/storybook/lib/react';
import { createStorybookDecoratorsFromDefault } from '@session/storybook/lib/utils';
import '@session/ui/styles';
import { WagmiMetadata } from '../lib/wagmi';
import { Web3ModalProvider } from '../providers/web3-modal-provider';

export const decorators = createStorybookDecoratorsFromDefault();

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const url = 'http://localhost:3000';

const wagmiMetadata: WagmiMetadata = {
  name: 'Session Staking',
  description: 'Session Staking',
  url,
  icons: [`${url}/images/icon.png`],
};

const preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Web3ModalProvider projectId={projectId} wagmiMetadata={wagmiMetadata}>
          <Story />
        </Web3ModalProvider>
      );
    },
  ],
} satisfies Preview;

export default preview;
