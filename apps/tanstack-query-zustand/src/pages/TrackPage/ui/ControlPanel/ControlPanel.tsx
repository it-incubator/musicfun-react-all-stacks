import { IconButton } from '@/shared/components'
import { PlayIcon } from '@/shared/icons'
import { TrackActions } from '@/features/tracks'
import { useTrackReactions } from '@/features/tracks/model/useTrackReactions'
import { PauseIcon } from '@/shared/icons'
import { convertApiTrackToPlayerTrack, type Track } from '@/player'
import { useCurrentTrack, usePlaybackState, usePlayerControls } from '@/player'
import { getClient } from '@/shared/api/client'

import s from './ControlPanel.module.css'

type ControlPanelProps = {
  track: Track
  trackId: string
  isOwnTrack: boolean
  isPublished: boolean
  currentReaction: number
  likesCount: number
}

export const ControlPanel = ({
  track,
  trackId,
  isOwnTrack,
  isPublished,
  currentReaction,
  likesCount,
}: ControlPanelProps) => {
  const { handleLike, handleDislike, handleRemoveReaction } = useTrackReactions(trackId)
  const { play, pause, resume } = usePlayerControls()
  const { track: currentTrack } = useCurrentTrack()
  const { isPlaying, isPaused } = usePlaybackState()

  const handlePlayClick = async () => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pause()
      } else if (isPaused) {
        resume()
      } else {
        play(track)
      }
      return
    }

    try {
      const response = await getClient().GET('/playlists/tracks/{trackId}', {
        params: { path: { trackId } },
      })

      if (response.data?.data) {
        const fullTrack: Track = convertApiTrackToPlayerTrack(response.data.data)
        play(fullTrack)
        return
      }
    } catch (error) {
      console.error('Failed to fetch track:', error)
    }

    play(track)
  }

  const isCurrentTrack = currentTrack?.id === track.id

  return (
    <div className={s.box}>
      <IconButton className={s.playButton} onClick={handlePlayClick}>
        {isCurrentTrack && isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>

      <TrackActions
        trackId={trackId}
        isOwner={isOwnTrack}
        isPublished={isPublished}
        size="large"
        currentReaction={currentReaction}
        likesCount={likesCount}
        onLike={handleLike}
        onDislike={handleDislike}
        onRemoveReaction={handleRemoveReaction}
      />
    </div>
  )
}
