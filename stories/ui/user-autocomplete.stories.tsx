import type { Meta, StoryObj } from '@storybook/react';
import { UserAutocomplete } from '@/components/ui/user-autocomplete';

const meta = {
  title: 'UI/UserAutocomplete',
  component: UserAutocomplete,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
    children: 'UserAutocomplete',
  },
};
