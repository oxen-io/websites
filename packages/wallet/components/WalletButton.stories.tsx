import type { Meta, StoryObj } from '@session/storybook/lib/react';

import { testEnsAvatarUrl } from '../.storybook/constants';
import { WALLET_STATUS } from '../hooks/wallet-hooks';
import { WalletButton } from './WalletModalButton';

const meta = {
  title: 'Wallet Components/Wallet Button',
  component: WalletButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      options: Object.values(WALLET_STATUS),
      control: {
        type: 'select',
      },
    },
    address: {
      control: {
        type: 'text',
      },
    },
    ensAvatar: {
      control: {
        type: 'text',
      },
    },
    ensName: {
      control: {
        type: 'text',
      },
    },
    arbName: {
      control: {
        type: 'text',
      },
    },
    fallbackName: {
      control: {
        type: 'text',
      },
    },
    handleClick: { action: 'clicked' },
  },
} satisfies Meta<typeof WalletButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const labels = {
  disconnected: 'Connect Wallet',
  connected: 'Open Wallet',
  connecting: 'Connecting Wallet...',
  reconnecting: 'Reconnecting Wallet...',
};

const ariaLabels = {
  connected: 'Open wallet account modal',
  disconnected: 'Open connect wallet modal',
};

const defaultArgs = {
  labels,
  ariaLabels,
  handleClick: () => {},
};

export const DisconnectedButton: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.DISCONNECTED,
  },
};

export const ConnectingButton: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTING,
    isLoading: true,
  },
};

export const ReconnectingButton: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.RECONNECTING,
    isLoading: true,
  },
};

export const ConnectedButtonNoAddress: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
  },
};

export const ConnectedButtonAddress: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
    address: '0x1234567890abcdef',
  },
};

export const ConnectedButtonArbName: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
    address: '0x1234567890abcdef',
    arbName: 'text.arb',
  },
};

export const ConnectedButtonArbNameMin: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
    address: '0x1234567890abcdef',
    arbName: 'abc.arb',
  },
};

export const ConnectedButtonArbNameLong: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
    address: '0x1234567890abcdef',
    arbName: 'longarbname.arb',
  },
};

export const ConnectedButtonEnsName: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
    address: '0x1234567890abcdef',
    ensName: 'test.eth',
  },
};

export const ConnectedButtonEnsNameMin: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
    address: '0x1234567890abcdef',
    ensName: 'abc.eth',
  },
};

export const ConnectedButtonEnsNameLong: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
    address: '0x1234567890abcdef',
    ensName: 'longensname.eth',
  },
};

export const ConnectedButtonEnsAvatar: Story = {
  args: {
    ...defaultArgs,
    status: WALLET_STATUS.CONNECTED,
    isConnected: true,
    address: '0x1234567890abcdef',
    ensName: 'test.eth',
    ensAvatar: testEnsAvatarUrl,
  },
};
