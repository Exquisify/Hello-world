import type { Meta, StoryObj } from '@storybook/react';
import { GradientText } from '@/components/ui/gradient-text';

const meta = {
  title: 'UI/GradientText',
  component: GradientText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GradientText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'GradientText',
  },
};
