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
  args: {},
} satisfies Meta<typeof ReactionButtons>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    reaction: 0,
    onLike: () => console.log('Liked!'),
    onDislike: () => console.log('Disliked!'),
  },
}

export const WithLikesCount: Story = {
  args: {
    reaction: 0,
    onLike: () => console.log('Liked!'),
    onDislike: () => console.log('Disliked!'),
    likesCount: 10,
  },
}

export const LikedState: Story = {
  args: {
    reaction: 1,
    onLike: () => console.log('Unlike'),
    onDislike: () => console.log('Disliked!'),
  },
}

export const DislikedState: Story = {
  args: {
    reaction: -1,
    onLike: () => console.log('Liked!'),
    onDislike: () => console.log('Remove dislike'),
  },
}

export const Interactive = {
  render: () => {
    const [reaction, setReaction] = useState<CurrentUserReaction>(0)

    const handleLike = () => {
      setReaction(reaction === 1 ? 0 : 1)
    }

    const handleDislike = () => {
      setReaction(reaction === -1 ? 0 : -1)
    }

    return (
      <Card style={{ padding: '24px', maxWidth: '300px' }}>
        <Typography variant="h3" style={{ marginBottom: '16px' }}>
          Interactive Reaction Buttons
        </Typography>

        <Typography variant="body2" style={{ marginBottom: '16px' }}>
          Try clicking the buttons below:
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ReactionButtons reaction={reaction} onLike={handleLike} onDislike={handleDislike} />
        </div>

        <Typography
          variant="caption"
          style={{ marginTop: '16px', textAlign: 'center', display: 'block' }}>
          Status: {reaction === 1 ? '👍 Liked' : reaction === -1 ? '👎 Disliked' : '😐 Neutral'}
        </Typography>
      </Card>
    )
  },
}

export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>
          Default
        </Typography>
        <ReactionButtons reaction={0} onLike={() => {}} onDislike={() => {}} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>
          Liked
        </Typography>
        <ReactionButtons reaction={1} onLike={() => {}} onDislike={() => {}} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>
          Disliked
        </Typography>
        <ReactionButtons reaction={-1} onLike={() => {}} onDislike={() => {}} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>
          With likes count
        </Typography>
        <ReactionButtons reaction={0} onLike={() => {}} onDislike={() => {}} likesCount={10} />
      </div>
    </div>
  ),
}
