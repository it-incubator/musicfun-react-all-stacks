import type { Meta, StoryObj } from '@storybook/react-vite'

import { ImageSizeType, ReactionValue } from '@/shared/api/schema.ts'

import { CurrentUserReaction } from '../../../../features/playlists/api'
import { PlaylistCard } from './PlaylistCard.tsx'

const meta: Meta<typeof PlaylistCard> = {
  title: 'entities/PlaylistCard',
  component: PlaylistCard,
}

export default meta

type Story = StoryObj<typeof PlaylistCard>

export const Default: Story = {
  args: {
    id: '1',
    title: 'Lofi for Vibe Coding',
    images: {
      main: [
        {
          url: 'https://unsplash.it/182/182',
          fileSize: 12,
          width: 1212,
          height: 2323,
          type: ImageSizeType.medium,
        },
      ],
    },
    description: 'A playlist for relaxing and unwinding.',
  },
}

export const WithReactions: Story = {
  args: {
    id: '1',
    title: 'Lofi for Vibe Coding',
    images: {
      main: [
        {
          url: 'https://unsplash.it/182/182',
          fileSize: 12,
          width: 1212,
          height: 2323,
          type: ImageSizeType.medium,
        },
      ],
    },
    description: 'A playlist for relaxing and unwinding.',
    render: () => <span>Like</span>,
  },
}

export const WithLongTextContent: Story = {
  args: {
    id: '1',
    title: 'The Best Hits of Elton John',
    images: {
      main: [
        {
          url: 'https://unsplash.it/182/182',
          fileSize: 12,
          width: 1212,
          height: 2323,
          type: ImageSizeType.medium,
        },
      ],
    },
    description:
      'A playlist for relaxing and unwinding. A playlist for relaxing and unwinding. A playlist for relaxing and unwinding. A playlist for relaxing and unwinding. A playlist for relaxing and unwinding. A playlist for relaxing and unwinding.',
  },
}
