import type { Meta, StoryObj } from '@storybook/react-vite'

import { MOCK_5_HASHTAGS } from '@/features/tags'

import { TrackOverview } from './TrackOverview'

const meta: Meta<typeof TrackOverview> = {
  title: 'entities/TrackOverview',
  component: TrackOverview,
}

export default meta

type Story = StoryObj<typeof TrackOverview>

export const Default: Story = {
  args: {
    title: 'Chill Mix',
    image: 'https://unsplash.it/297/297',
    releaseDate: '2025-01-01',
    artists: ['Julia Wolf', 'ayokay', 'Khalid'],
    tags: MOCK_5_HASHTAGS,
  },
}

export const LongTitle: Story = {
  args: {
    title: 'This is a Very Long Track Title That Should Scale Responsively',
    image: 'https://unsplash.it/299/299',
    releaseDate: '2025-01-01',
    artists: ['Julia Wolf', 'ayokay', 'Khalid'],
    tags: MOCK_5_HASHTAGS,
  },
}
