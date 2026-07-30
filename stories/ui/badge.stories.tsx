import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Badge',
  },
};
