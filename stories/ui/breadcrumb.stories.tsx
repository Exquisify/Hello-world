import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Breadcrumb',
  },
};
