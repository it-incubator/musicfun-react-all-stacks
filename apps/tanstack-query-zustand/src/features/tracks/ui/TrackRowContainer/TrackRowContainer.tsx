import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { TrackRow, TrackActions } from '@/features/tracks'
import { useTrackReactions } from '../../model/useTrackReactions'
import type { TrackRowData } from '..'
import s from './TrackRowContainer.module.css'

export interface TrackRowContainerProps {
  trackRow: TrackRowData
  currentTrack: { id: string } | null
  currentTime: number
  onPlayClick: (id: string) => void
  playlistId?: string
}
export const TrackRowContainer = ({
  trackRow,
  currentTrack,
  currentTime,
  onPlayClick,
  playlistId,
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
        <div className={s.actionsCell}>
          <TrackActions
            trackId={trackRow.id}
            currentReaction={trackRow.currentUserReaction}
            likesCount={trackRow.likesCount}
            onLike={handleLike}
            onDislike={handleDislike}
            onRemoveReaction={handleRemoveReaction}
            isOwner={trackRow.ownerId === currentUserId}
            isPublished={trackRow.isPublished}
            playlistId={playlistId}
          />
        </div>
      )}
    />
  )
}
