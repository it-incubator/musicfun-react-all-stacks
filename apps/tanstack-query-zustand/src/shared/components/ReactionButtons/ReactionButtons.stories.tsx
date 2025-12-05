import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Card } from '../Card'
import { Typography } from '../Typography'
import { type CurrentUserReaction, ReactionButtons } from './ReactionButtons'

const meta = {
  title: 'Components/ReactionButtons',
  component: ReactionButtons,
  parameters: {
    layout: 'centered',
  },
  args: {
    entityId: '123', // Required prop, providing a default value
  },
} satisfies Meta<typeof ReactionButtons>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentReaction: 0,
    onLike: () => console.log('Liked!'),
    onDislike: () => console.log('Disliked!'),
    onRemoveReaction: () => console.log('Reaction removed!'),
  },
}

export const WithLikesCount: Story = {
  args: {
    currentReaction: 0,
    onLike: () => console.log('Liked!'),
    onDislike: () => console.log('Disliked!'),
    onRemoveReaction: () => console.log('Reaction removed!'),
    likesCount: 10,
  },
}

export const LikedState: Story = {
  args: {
    currentReaction: 1,
    onLike: () => console.log('Unlike'),
    onDislike: () => console.log('Disliked!'),
    onRemoveReaction: () => console.log('Reaction removed!'),
  },
}

export const DislikedState: Story = {
  args: {
    currentReaction: -1,
    onLike: () => console.log('Liked!'),
    onDislike: () => console.log('Remove dislike'),
    onRemoveReaction: () => console.log('Reaction removed!'),
  },
}

export const LargeSize: Story = {
  args: {
    currentReaction: 0,
    onLike: () => console.log('Liked!'),
    onDislike: () => console.log('Disliked!'),
    onRemoveReaction: () => console.log('Reaction removed!'),
    size: 'large',
  },
}

export const Interactive = {
  render: () => {
    const [currentReaction, setCurrentReaction] = useState<CurrentUserReaction>(0)

    const handleLike = () => {
      setCurrentReaction(currentReaction === 1 ? 0 : 1)
    }

    const handleDislike = () => {
      setCurrentReaction(currentReaction === -1 ? 0 : -1)
    }

    const handleRemove = () => {
      setCurrentReaction(0)
    }

    return (
      <Card
        style={{
          padding: '24px',
          maxWidth: '300px',
        }}>
        <Typography variant="h3" style={{ marginBottom: '16px' }}>
          Interactive Reaction Buttons
        </Typography>

        <Typography variant="body2" style={{ marginBottom: '16px' }}>
          Try clicking the buttons below:
        </Typography>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <ReactionButtons
            entityId="123"
            currentReaction={currentReaction}
            onLike={handleLike}
            onDislike={handleDislike}
            onRemoveReaction={handleRemove}
          />
        </div>

        <Typography
          variant="caption"
          style={{
            marginTop: '16px',
            textAlign: 'center',
            display: 'block',
          }}>
          Status:{' '}
          {currentReaction === 1
            ? '👍 Liked'
            : currentReaction === -1
              ? '👎 Disliked'
              : '😐 Neutral'}
        </Typography>
      </Card>
    )
  },
}

export const AllStates = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
      }}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>
          Default
        </Typography>
        <ReactionButtons
          entityId="123"
          currentReaction={0}
          onLike={() => {}}
          onDislike={() => {}}
          onRemoveReaction={() => {}}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>
          Liked
        </Typography>
        <ReactionButtons
          entityId="123"
          currentReaction={1}
          onLike={() => {}}
          onDislike={() => {}}
          onRemoveReaction={() => {}}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>
          Disliked
        </Typography>
        <ReactionButtons
          entityId="123"
          currentReaction={-1}
          onLike={() => {}}
          onDislike={() => {}}
          onRemoveReaction={() => {}}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>
          With likes count
        </Typography>
        <ReactionButtons
          entityId="123"
          currentReaction={0}
          onLike={() => {}}
          onDislike={() => {}}
          onRemoveReaction={() => {}}
          likesCount={10}
        />
      </div>
    </div>
  ),
}
