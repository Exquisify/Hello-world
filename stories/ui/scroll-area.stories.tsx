import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '@/components/ui/scroll-area';

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'ScrollArea',
  },
};
