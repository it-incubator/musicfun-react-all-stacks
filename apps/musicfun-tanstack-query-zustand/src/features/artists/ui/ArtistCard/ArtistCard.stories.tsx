import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArtistCard } from './ArtistCard'

const meta: Meta<typeof ArtistCard> = {
  title: 'entities/ArtistCard',
  component: ArtistCard,
}

export default meta

type Story = StoryObj<typeof ArtistCard>

export const Default: Story = {
  args: {
    image: 'https://unsplash.it/182/182',
    name: 'Kanye West',
  },
}

export const WithLongTextContent: Story = {
  args: {
    image: 'https://unsplash.it/183/183',
    name: 'Drake & The Weeknd & Kanye West',
  },
}
