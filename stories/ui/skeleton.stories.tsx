import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/ui/skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Skeleton',
  },
};
