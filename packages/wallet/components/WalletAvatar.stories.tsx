import type { Meta, StoryObj } from '@session/storybook/lib/react';

import { testEnsAvatarUrl } from '../.storybook/constants';
import { WalletAvatar } from './WalletAvatar';
import WalletModalButton from './WalletModalButton';

const meta = {
  title: 'Wallet Components/Wallet Avatar',
  component: WalletAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    avatarSrc: {
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
    walletIcon: {
      control: {
        type: 'text',
      },
    },
    walletName: {
      control: {
        type: 'text',
      },
    },
    className: {
      control: {
        type: 'text',
      },
    },
  },
} satisfies Meta<typeof WalletAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Avatar: Story = {
  args: {
    className: 'w-12 h-12',
    avatarSrc: testEnsAvatarUrl,
  },
};

export const ButtonAvatar: Story = {
  args: {
    className: 'w-4 h-4',
    avatarSrc: testEnsAvatarUrl,
  },
};

export const AvatarNoSrcs: Story = {
  args: {
    className: 'w-12 h-12',
  },
};

export const AvatarAvatarSrc: Story = {
  name: 'Avatar with avatarSrc',
  args: {
    className: 'w-12 h-12',
    ensAvatar: testEnsAvatarUrl,
  },
};

export const AvatarEnsAvatar: Story = {
  name: 'Avatar with ensAvatar',
  args: {
    className: 'w-12 h-12',
    ensAvatar: testEnsAvatarUrl,
  },
};

export const AvatarWalletIcon: Story = {
  name: 'Avatar with walletIcon',
  args: {
    className: 'w-12 h-12',
    walletIcon: testEnsAvatarUrl,
  },
};

export const AvatarFallback: Story = {
  name: 'Avatar with invalid avatarSrc and valid ensAvatar fallback',
  args: {
    className: 'w-12 h-12',
    avatarSrc: 'invalid',
    ensAvatar: testEnsAvatarUrl,
  },
};

export const AvatarFallback2: Story = {
  name: 'Avatar with invalid avatarSrc and invalid ensAvatar and valid walletIcon',
  args: {
    className: 'w-12 h-12',
    avatarSrc: 'invalid',
    ensAvatar: 'invalid',
    walletIcon: testEnsAvatarUrl,
  },
};

export const AvatarAllInvalid: Story = {
  name: 'Avatar with invalid avatarSrc, ensAvatar, and walletIcon',
  args: {
    className: 'w-12 h-12',
    avatarSrc: 'invalid',
    ensAvatar: 'invalid',
    walletIcon: 'invalid',
  },
};

export const AvatarFallbackInvalidEnsAvatarSrcWalletFallback: Story = {
  args: {
    className: 'w-12 h-12',
    ensAvatar: 'invalid',
    walletIcon: testEnsAvatarUrl,
  },
};

export const ButtonAvatarFallbackWalletSrc: Story = {
  args: {
    className: 'w-12 h-12',
  },
  decorators: [
    (Story) => (
      <div className="flex flex-row gap-10">
        <WalletModalButton
          labels={{
            disconnected: 'Connect Wallet',
            connected: 'Open Wallet',
            connecting: 'Connecting Wallet...',
            reconnecting: 'Reconnecting Wallet...',
          }}
          ariaLabels={{
            connected: 'Open wallet account modal',
            disconnected: 'Open connect wallet modal',
          }}
          fallbackName="No name"
        />
        <Story />
      </div>
    ),
  ],
};
