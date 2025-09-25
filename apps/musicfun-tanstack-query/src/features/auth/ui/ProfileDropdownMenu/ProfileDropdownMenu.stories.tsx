import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProfileDropdownMenu } from './ProfileDropdownMenu'

const meta: Meta<typeof ProfileDropdownMenu> = {
  title: 'entities/ProfileDropdownMenu',
  component: ProfileDropdownMenu,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof ProfileDropdownMenu>

export const Default: Story = {
  args: {
    avatar: 'https://unsplash.it/182/182',
  },
}
