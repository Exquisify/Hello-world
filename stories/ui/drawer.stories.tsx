import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@/components/ui/drawer';

const meta = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Drawer',
  },
};
