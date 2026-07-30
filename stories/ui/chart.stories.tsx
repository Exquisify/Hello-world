import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@/components/ui/chart';

const meta = {
  title: 'UI/Chart',
  component: Chart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Chart',
  },
};
