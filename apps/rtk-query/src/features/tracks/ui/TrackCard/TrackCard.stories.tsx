import type { Meta, StoryObj } from '@storybook/react-vite'

import { TrackCard } from './TrackCard'

const meta: Meta<typeof TrackCard> = {
  title: 'entities/TrackCard',
  component: TrackCard,
}

export default meta

type Story = StoryObj<typeof TrackCard>

export const Default: Story = {
  args: {
    id: '1',
    title: 'Name Song',
    imageSrc: 'https://unsplash.it/182/182',
    artistNames: ['Ed Sheeran', 'Big Sean', 'Juice W'],
  },
}

export const WithLongTextContent: Story = {
  args: {
    id: '1',
    title: 'A very long track title that should be truncated',
    imageSrc: 'https://unsplash.it/183/183',
    artistNames: ['Ed Sheeran', 'Big Sean', 'Juice W'],
  },
}
