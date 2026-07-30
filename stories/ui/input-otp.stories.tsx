import type { Meta, StoryObj } from '@storybook/react';
import { InputOtp } from '@/components/ui/input-otp';

const meta = {
  title: 'UI/InputOtp',
  component: InputOtp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputOtp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'InputOtp',
  },
};
