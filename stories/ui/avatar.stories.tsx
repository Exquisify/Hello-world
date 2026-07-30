import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@/components/ui/avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Avatar',
  },
};
