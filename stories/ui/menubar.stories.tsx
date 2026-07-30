import type { Meta, StoryObj } from '@storybook/react';
import { Menubar } from '@/components/ui/menubar';

const meta = {
  title: 'UI/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Menubar',
  },
};
