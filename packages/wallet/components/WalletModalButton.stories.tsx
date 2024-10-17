import type { Meta, StoryObj } from '@session/storybook/lib/react';

import WalletModalButton from './WalletModalButton';

const meta = {
  title: 'Wallet Components/Wallet Modal Button',
  component: WalletModalButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WalletModalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkingButton: Story = {
  args: {
    labels: {
      disconnected: 'Connect Wallet',
      connected: 'Open Wallet',
      connecting: 'Connecting Wallet...',
      reconnecting: 'Reconnecting Wallet...',
    },
    ariaLabels: {
      connected: 'Open wallet account modal',
      disconnected: 'Open connect wallet modal',
    },
  },
};
