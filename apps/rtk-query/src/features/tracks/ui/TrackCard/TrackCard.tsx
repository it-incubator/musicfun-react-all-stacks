import { Link } from 'react-router'

import {
  type FetchTracksAttributes,
  type TrackDetails,
  useDislikeTrackMutation,
  useLikeTrackMutation,
  useUnReactionTrackMutation,
} from '@/features/tracks'
import { playTrack, useCurrentTrack, usePlaybackState, usePlayerControls } from '@/player'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Card, IconButton, ReactionButtons, Typography } from '@/shared/components'
import { useAppDispatch } from '@/shared/hooks'
import { PauseIcon, PlayIcon } from '@/shared/icons'
import { ImageType } from '@/shared/types'
import { getImageByType } from '@/shared/utils'

import s from './TrackCard.module.css'

type Props = {
  track: TrackDetails<FetchTracksAttributes>
  loadPlaylistToPLayer: (trackId: string) => void
}

export const TrackCard = ({ track, loadPlaylistToPLayer }: Props) => {
  const dispatch = useAppDispatch()

  const [like] = useLikeTrackMutation({
    fixedCacheKey: `track-reaction-${track.id}`,
  })
  const [dislike] = useDislikeTrackMutation({
    fixedCacheKey: `track-reaction-${track.id}`,
  })
  const [unReaction] = useUnReactionTrackMutation({
    fixedCacheKey: `track-reaction-${track.id}`,
  })

  const { trackId: playerTrackId } = useCurrentTrack()
  const { pause, resume } = usePlayerControls()
  const { isPlaying } = usePlaybackState()

  const isPlayerTrack = playerTrackId && playerTrackId === track.id
  const isTrackPlaying = isPlayerTrack && isPlaying

  const trackCover =
    getImageByType(track.attributes.images, ImageType.MEDIUM)?.url || noCoverPlaceholder

  const handlePlayback = () => {
    if (isPlayerTrack) {
      if (isPlaying) {
        pause()
      } else {
        resume()
      }
      return
    }
    loadPlaylistToPLayer(track.id)
    dispatch(
      playTrack({
        track: {
          id: track.id,
          title: track.attributes.title,
          artist: '',
          url: track.attributes.attachments[0].url,
          duration: 100,
          albumArt: trackCover,
        },
      })
    )
  }

  return (
    <Card className={s.card}>
      <div className={s.image}>
        <img src={trackCover} alt={track.attributes.title} />
        <IconButton className={s.playback} onClick={handlePlayback}>
          {isTrackPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
      </div>

      <Typography variant="h3" className={s.title} as={Link} to={`/tracks/${track.id}`}>
        {track.attributes.title}
      </Typography>

      <Typography variant="body3" className={s.artists}>
        {['Freddie Mercury', 'John Lennon'].join(', ')}
      </Typography>
      <ReactionButtons
        reaction={track.attributes.currentUserReaction}
        onLike={() => like({ trackId: track.id })}
        onDislike={() => dislike({ trackId: track.id })}
        likesCount={track.attributes.likesCount}
        onUnReaction={() => unReaction({ trackId: track.id })}
      />
    </Card>
  )
}
