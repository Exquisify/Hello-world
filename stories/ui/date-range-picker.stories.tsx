import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'DateRangePicker',
  },
};
