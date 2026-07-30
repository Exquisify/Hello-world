import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible } from '@/components/ui/collapsible';

const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Collapsible',
  },
};
