import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from '@/shared/components'

import { PlaylistCardSkeleton } from './PlaylistCardSkeleton'

const meta: Meta<typeof PlaylistCardSkeleton> = {
  title: 'skeletons/PlaylistCardSkeleton',
  component: PlaylistCardSkeleton,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof PlaylistCardSkeleton>

export const Default: Story = {
  args: {},
}

export const WithReactionButtons: Story = {
  args: {
    showReactionButtons: true,
  },
}

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '12px' }}>
          Without reaction buttons
        </Typography>
        <PlaylistCardSkeleton />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '12px' }}>
          With reaction buttons
        </Typography>
        <PlaylistCardSkeleton showReactionButtons />
      </div>
    </div>
  ),
}

export const GridExample = {
  render: () => (
    <div style={{ width: '900px' }}>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        Playlist cards loading example
      </Typography>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(264px, 1fr))',
          gap: '16px',
        }}>
        {Array.from({ length: 6 }, (_, i) => (
          <PlaylistCardSkeleton key={i} showReactionButtons={i % 2 === 0} />
        ))}
      </div>
    </div>
  ),
}

export const ComparisonWithReal = {
  render: () => (
    <div style={{ width: '600px' }}>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        Comparison with real cards
      </Typography>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
            Skeleton
          </Typography>
          <PlaylistCardSkeleton />
        </div>

        <div>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
            Skeleton with reactions
          </Typography>
          <PlaylistCardSkeleton showReactionButtons />
        </div>
      </div>
    </div>
  ),
}
