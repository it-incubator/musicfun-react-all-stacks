import type { Meta, StoryObj } from '@storybook/react-vite'

import { AccountMenu } from './AccountMenu'

const meta: Meta<typeof AccountMenu> = {
  title: 'entities/AccountMenu',
  component: AccountMenu,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof AccountMenu>

export const Default: Story = {
  args: {
    avatar: 'https://unsplash.it/182/182',
    fullName: { name: 'Kanye', surname: 'West' },
    id: '1',
  },
}
