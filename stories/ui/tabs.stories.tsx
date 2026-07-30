import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@/components/ui/tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Tabs',
  },
};
