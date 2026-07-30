import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from '@/components/ui/toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Toast',
  },
};
