import type { Meta, StoryObj } from '@storybook/react';
import { UseMobile } from '@/components/ui/use-mobile';

const meta = {
  title: 'UI/UseMobile',
  component: UseMobile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UseMobile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'UseMobile',
  },
};
