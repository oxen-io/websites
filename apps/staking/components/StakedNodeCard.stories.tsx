import type { Meta, StoryObj } from '@session/storybook/lib/react';

import { NODE_STATE } from '@session/sent-staking-js';
import { NODE_STATE_VALUES, StakedNodeCard } from './StakedNodeCard';

const meta = {
  title: 'Staking/Staked Node Card',
  component: StakedNodeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    node: {
      pubKey: {
        control: {
          type: 'text',
        },
      },
      state: {
        options: NODE_STATE_VALUES,
        control: {
          type: 'radio',
        },
      },
      contributors: {
        control: {
          type: 'object',
        },
      },
      lastRewardHeight: {
        control: {
          type: 'number',
        },
      },
      lastUptime: {
        control: {
          type: 'date',
        },
      },
      balance: {
        control: {
          type: 'number',
        },
      },
      operatorFee: {
        control: {
          type: 'number',
        },
      },
      operator_address: {
        control: {
          type: 'text',
        },
      },
    },
  },
} satisfies Meta<typeof StakedNodeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    node: {
      state: NODE_STATE.RUNNING,
      contributors: [
        {
          address: '0x1234567891',
          amount: 100,
        },
        {
          address: '0x1234567892',
          amount: 500,
        },
        {
          address: '0x1234567893',
          amount: 1000,
        },
      ],
      lastRewardHeight: 1000,
      lastUptime: new Date(),
      pubKey: '0x1234567890',
      balance: 1000,
      operatorFee: 10,
      operator_address: '0x1234567890',
    },
  },
};
