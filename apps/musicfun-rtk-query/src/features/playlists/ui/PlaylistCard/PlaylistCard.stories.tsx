import type { Meta, StoryObj } from '@storybook/react-vite'

import { CurrentUserReaction } from '@/features/playlists'
import { DropdownMenu, DropdownMenuTrigger } from '@/shared/components'
import { MoreIcon } from '@/shared/icons'

import { PlaylistCard } from './PlaylistCard'

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
    imageSrc: 'https://unsplash.it/182/182',
    description: 'A playlist for relaxing and unwinding.',
  },
}

export const WithReactions: Story = {
  args: {
    id: '1',
    title: 'Lofi for Vibe Coding',
    imageSrc: 'https://unsplash.it/182/182',
    description: 'A playlist for relaxing and unwinding.',
    isShowReactionButtons: true,
    reaction: CurrentUserReaction.Like,
    likesCount: 10,
  },
}

export const WithLongTextContent: Story = {
  args: {
    id: '1',
    title: 'The Best Hits of Elton John',
    imageSrc: 'https://unsplash.it/183/183',
    description:
      'A playlist for relaxing and unwinding. A playlist for relaxing and unwinding. A playlist for relaxing and unwinding. A playlist for relaxing and unwinding. A playlist for relaxing and unwinding. A playlist for relaxing and unwinding.',
  },
}

export const WithActions: Story = {
  args: {
    id: '1',
    title: 'Lofi for Vibe Coding',
    imageSrc: 'https://unsplash.it/182/182',
    description: 'A playlist for relaxing and unwinding.',
    actions: (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreIcon />
        </DropdownMenuTrigger>
      </DropdownMenu>
    ),
  },
}
