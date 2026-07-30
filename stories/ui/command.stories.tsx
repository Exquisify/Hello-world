import type { Meta, StoryObj } from '@storybook/react';
import { Command } from '@/components/ui/command';

const meta = {
  title: 'UI/Command',
  component: Command,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Command',
  },
};
