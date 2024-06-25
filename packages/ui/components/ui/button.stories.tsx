import type { Meta, StoryObj } from '@session/storybook/lib/react';

import { Button } from './button';

const meta = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      control: {
        type: 'radio',
      },
    },
    size: {
      options: ['md', 'sm', 'lg', 'icon'],
      control: {
        type: 'radio',
      },
    },
    onClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'My Button',
    'data-testid': 'button:storybook',
  },
};
