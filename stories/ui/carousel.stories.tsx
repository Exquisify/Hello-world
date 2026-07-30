import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '@/components/ui/carousel';

const meta = {
  title: 'UI/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'Carousel',
  },
};
