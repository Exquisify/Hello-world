import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from '@/components/ui/navigation-menu';

const meta = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'NavigationMenu',
  },
};
