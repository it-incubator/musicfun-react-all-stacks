import { useFetchTrackByIdQuery } from '@/features/tracks/api'
import { TrackActions } from '@/features/tracks/ui/TrackActions'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import type { TrackRowData } from '@/features/tracks/ui/TracksTable'
import { CurrentUserReaction } from '@/shared/types'

type TrackRowContainerProps = {
  trackRow: TrackRowData
  playlistId?: string
  userId?: string
}

export const TrackRowContainer = ({ trackRow, userId, playlistId }: TrackRowContainerProps) => {
  const { data: trackData } = useFetchTrackByIdQuery({ trackId: trackRow.id })
  const isTrackOwner = userId === trackData?.data.attributes.user.id

  return (
    <TrackRow
      trackRow={trackRow}
      playingTrackId={'mock'}
      playingTrackProgress={20}
      renderActionsCell={(row) => (
        <TrackActions
          likesCount={row.likesCount ?? 0}
          reaction={row.currentUserReaction ?? CurrentUserReaction.None}
          trackId={row.id}
          isOwner={isTrackOwner}
          playlistId={playlistId}
        />
      )}
    />
  )
}
