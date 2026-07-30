import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '@/components/ui/table';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Table',
  },
};
