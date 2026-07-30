import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from '@/components/ui/context-menu';

const meta = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'ContextMenu',
  },
};
