import type { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar } from './Avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const LoginInitial: Story = {
  args: {},
}

export const InitialsOnly: Story = {
  args: {
    fullName: { name: 'james', surname: 'allen' },
  },
}

export const ProfileImage: Story = {
  args: {
    src: 'https://unsplash.it/192/192',
    fullName: { name: 'james', surname: 'allen' },
    userLogin: 'james',
  },
}
