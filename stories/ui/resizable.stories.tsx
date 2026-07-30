import type { Meta, StoryObj } from '@storybook/react';
import { Resizable } from '@/components/ui/resizable';

const meta = {
  title: 'UI/Resizable',
  component: Resizable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Resizable',
  },
};
