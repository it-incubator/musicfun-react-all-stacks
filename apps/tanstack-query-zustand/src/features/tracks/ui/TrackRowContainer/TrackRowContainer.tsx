import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { ReactionButtons } from '@/shared/components'
import { DropdownMenu, DropdownMenuTrigger } from '@/shared/components'
import { MoreIcon } from '@/shared/icons'

import { useTrackReactions } from '../../model/useTrackReactions'
import type { TrackRowData } from '..'
export interface TrackRowContainerProps {
  trackRow: TrackRowData
  currentTrack: { id: string } | null
  currentTime: number
  onPlayClick: (id: string) => void
}
export const TrackRowContainer = ({
  trackRow,
  currentTrack,
  currentTime,
  onPlayClick,
}: TrackRowContainerProps) => {
  const { handleLike, handleDislike, handleRemoveReaction } = useTrackReactions(trackRow.id)

  const { data: me } = useMeQuery()
  const currentUserId = me?.userId

  return (
    <TrackRow
      trackRow={trackRow}
      playingTrackId={currentTrack?.id}
      playingTrackProgress={currentTime}
      onPlayClick={onPlayClick}
      renderActionsCell={() => (
        <>
          <ReactionButtons
            entityId={trackRow.id}
            currentReaction={trackRow.currentUserReaction}
            likesCount={trackRow.likesCount}
            onDislike={handleDislike}
            onLike={handleLike}
            onRemoveReaction={handleRemoveReaction}
          />
          {trackRow.ownerId === currentUserId && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                {/* implement add to playlist (via popup, see figma) */}
                <MoreIcon />
              </DropdownMenuTrigger>
            </DropdownMenu>
          )}
        </>
      )}
    />
  )
}
