import { MOCK_TRACKS } from '@/features/tracks'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { TracksTable } from '@/features/tracks/ui/TracksTable/TracksTable'
import { ReactionButtons } from '@/shared/components'
import { DropdownMenu, DropdownMenuTrigger } from '@/shared/components'
import { MoreIcon } from '@/shared/icons'

export const LikedTracksTab = () => {
  return (
    <TracksTable
      trackRows={MOCK_TRACKS.map((track, index) => ({
        index,
        id: track.id,
        title: track.attributes.title,
        image: track.attributes.images.main[0].url,
        addedAt: track.attributes.addedAt,
        artists: track.attributes.artists?.map((artist) => artist.name) || [],
        duration: track.attributes.duration,
        likesCount: track.attributes.likesCount,
        dislikesCount: track.attributes.dislikesCount,
        currentUserReaction: track.attributes.currentUserReaction,
      }))}
      renderTrackRow={(trackRow) => (
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
              </DropdownMenu>
            </>
          )}
        />
      )}
    />
  )
}
