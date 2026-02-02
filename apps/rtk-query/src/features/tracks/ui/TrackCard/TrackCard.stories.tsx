import type { Meta, StoryObj } from '@storybook/react-vite'

import { MOCK_TRACKS } from '@/features/tracks'
import { ImageType } from '@/shared/types'

import { TrackCard } from './TrackCard'

const meta: Meta<typeof TrackCard> = {
  title: 'entities/TrackCard',
  component: TrackCard,
}

export default meta

type Story = StoryObj<typeof TrackCard>

export const Default: Story = {
  args: {
    track: {
      ...MOCK_TRACKS[0],
      type: 'tracks',
      attributes: {
        ...MOCK_TRACKS[0].attributes,
        images: {
          main: [
            {
              ...MOCK_TRACKS[0].attributes.images.main[0],
              type: 'original' as ImageType,
            },
          ],
        },
      },
      relationships: {
        artists: {
          data: [],
        },
      },
    },
  },
}

export const WithLongTextContent: Story = {
  args: {
    track: {
      ...MOCK_TRACKS[2],
      type: 'tracks',
      attributes: {
        ...MOCK_TRACKS[2].attributes,
        title: 'A very long track title that should be truncated',
        images: {
          main: [
            {
              ...MOCK_TRACKS[2].attributes.images.main[0],
              type: 'original' as ImageType,
            },
          ],
        },
      },
      relationships: {
        artists: {
          data: [],
        },
      },
    },
  },
}
