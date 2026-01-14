import type { Meta, StoryObj } from '@storybook/react-vite'

import { AudioPlayerSkeleton } from './AudioPlayerSkeleton.tsx'

const meta: Meta<typeof AudioPlayerSkeleton> = {
  title: 'Player/AudioPlayerSkeleton',
  component: AudioPlayerSkeleton,
}

export default meta

type Story = StoryObj<typeof AudioPlayerSkeleton>

export const Default: Story = {}
