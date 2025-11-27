import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { ReactionButtons } from '@/shared/components'
import { DropdownMenu, DropdownMenuTrigger } from '@/shared/components'
import { MoreIcon } from '@/shared/icons'
import { useTrackReactions } from '@/features/tracks/model/use-tracks-reactions'
import type { TrackRowData } from '..'
export interface TrackRowContainerProps {
  trackRow: TrackRowData
  currentTrack: { id: string } | null
  currentTime: number
  onPlayClick: (id: string) => void
}
export const TrackRowContainer = ({ trackRow, currentTrack, currentTime, onPlayClick }: TrackRowContainerProps) => {
  const { handleLike, handleDislike, handleRemoveReaction } = useTrackReactions(trackRow.id)

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

          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreIcon />
            </DropdownMenuTrigger>
          </DropdownMenu>
        </>
      )}
    />
  )
}
