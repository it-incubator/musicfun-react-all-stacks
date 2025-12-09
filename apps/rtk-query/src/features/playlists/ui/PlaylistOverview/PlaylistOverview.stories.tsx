import type { Meta, StoryObj } from '@storybook/react-vite'

import { MOCK_5_HASHTAGS } from '@/features/tags'

import { PlaylistOverview } from '../PlaylistOverview'

const meta: Meta<typeof PlaylistOverview> = {
  title: 'entities/PlaylistOverview',
  component: PlaylistOverview,
}

export default meta

type Story = StoryObj<typeof PlaylistOverview>

export const Default: Story = {
  args: {
    title: 'Chill Mixg',
    image: 'https://unsplash.it/297/297',
    description: 'Julia Wolf, ayokay, Khalid and more',
    tags: MOCK_5_HASHTAGS.map((tag) => ({ id: tag.id, name: tag.name })),
  },
}

export const LongTitle: Story = {
  args: {
    title: 'This is a Very Long Playlist Title That Should Scale Responsively',
    image: 'https://unsplash.it/299/299',
    description: 'A collection of amazing tracks from various artists around the world',
    tags: MOCK_5_HASHTAGS.map((tag) => ({ id: tag.id, name: tag.name })),
  },
}
