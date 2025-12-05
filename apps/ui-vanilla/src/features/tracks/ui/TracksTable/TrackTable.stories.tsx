import type { Meta, StoryObj } from '@storybook/react-vite'

import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import {
  CurrentUserReaction,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ReactionButtons,
} from '@/shared/components'
import { MoreIcon } from '@/shared/icons'

import { MOCK_TRACKS } from '../../api'
import { TracksTable } from './TracksTable'

const meta: Meta<typeof TracksTable> = {
  title: 'entities/TracksTable',
  component: TracksTable,
}

export default meta

type Story = StoryObj<typeof TracksTable>

type ReactionsProps =
  | {
      likesCount: number
      dislikesCount: number
      currentUserReaction: CurrentUserReaction
    }
  | {
      likesCount?: undefined
      dislikesCount?: undefined
      currentUserReaction?: undefined
    }

export type TrackRowData = {
  index: number
  image: string
  id: string
  title: string
  addedAt: string
  artists: string[]
  duration: number
} & ReactionsProps

export const Default: Story = {
  args: {
    trackRows: MOCK_TRACKS.map((track, index) => ({
      index: index,
      id: track.id,
      title: track.attributes.title,
      image: track.attributes.images.main[0].url,
      addedAt: track.attributes.addedAt,
      artists: track.attributes.artists?.map((artist) => artist.name) || [],
      isPlaying: false,
      likesCount: track.attributes.likesCount,
      dislikesCount: track.attributes.dislikesCount,
      currentUserReaction: track.attributes.currentUserReaction,
      duration: track.attributes.duration,
    })),
    renderTrackRow: (trackRow) => (
      <TrackRow
        trackRow={trackRow}
        playingTrackId={MOCK_TRACKS[0].id}
        playingTrackProgress={20}
        renderActionsCell={() => (
          <>
            <ReactionButtons
              reaction={trackRow.currentUserReaction}
              onLike={() => {}}
              onDislike={() => {}}
              likesCount={trackRow.likesCount}
            />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreIcon />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => alert('Edit clicked!')}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Add to playlist clicked!')}>
                  Add to playlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
                  Show text song
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      />
    ),
  },
}

export const WithoutReactions: Story = {
  args: {
    trackRows: MOCK_TRACKS.map((track, index) => ({
      index: index,
      id: track.id,
      title: track.attributes.title,
      image: track.attributes.images.main[0].url,
      addedAt: track.attributes.addedAt,
      artists: track.attributes.artists?.map((artist) => artist.name) || [],
      duration: track.attributes.duration,
    })),
    renderTrackRow: (trackRow) => (
      <TrackRow
        trackRow={trackRow}
        playingTrackId={MOCK_TRACKS[0].id}
        playingTrackProgress={20}
        renderActionsCell={() => (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreIcon />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => alert('Edit clicked!')}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Add to playlist clicked!')}>
                  Add to playlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
                  Show text song
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      />
    ),
  },
}
