import s from '../TracksList.module.css'
import trackDefaultCover from '@/assets/img/track-default-cover.jpg'
import { IconButton } from '@/common/components'
import { MoreIcon, BarsIcon } from '@/common/icons'
import { TrackDuration } from './TrackDuration/TrackDuration.tsx'
import type { FetchTracksAttributes, TrackDetails } from '@/features/tracks/api/tracksApi.types.ts'
import { useGetMeQuery } from '@/features/auth/api/auth-api.ts'
import { usePlayer } from '@/features/player/lib/hooks/usePlayer.ts'
import { useState } from 'react'
import { ProgressBar } from './ProgressBar/ProgressBar.tsx'
import { TrackPlayer } from '@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackPlayer/TrackPlayer.tsx'
import { TrackReactions } from './TrackReaction/TrackReaction.tsx'
import { usePublishTrackMutation } from '@/features/tracks/api/tracksApi.ts'

type Props = {
  track: TrackDetails<FetchTracksAttributes>
  isReactionMutable: boolean
  index: number
  pageSize: number
  page: number
}

export const TrackItem = ({ track, pageSize, page, index, isReactionMutable }: Props) => {
  const { data: userData } = useGetMeQuery()
  const [isHovered, setIsHovered] = useState(false)

  const numTrack = (index: number) => {
    return pageSize * (page - 1) + index + 1
  }

  const originalCover = track.attributes.images.main.find((img) => img.type === 'thumbnail')
  const audioUrl = track.attributes.attachments?.[0]?.url || ''

  const [player, isPlayingMe] = usePlayer(true, track)
  const [publishTrack, { isLoading }] = usePublishTrackMutation()

  const isTrackPublished = track.attributes.isPublished

  const renderTrackNumber = () => {
    if (isHovered) {
      return <TrackPlayer track={track} player={player} isPlayingMe={isPlayingMe} />
    }

    if (isPlayingMe) {
      return <BarsIcon />
    }

    return numTrack(index)
  }

  return (
    <div
      key={track.id}
      className={s.track}
      onDoubleClick={() => player.play(track)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={s.numTrack}>{renderTrackNumber()}</div>
      <div className={s.description}>
        <img
          src={originalCover ? originalCover.url : trackDefaultCover}
          alt={`Cover for ${track.attributes.title}`}
          className={s.cover}
        />
        <div>
          <div className={`${isPlayingMe ? s.activeTitle : ''}`}>{track.attributes.title}</div>
          <div>{track.attributes.user.name}</div>
        </div>
      </div>
      <div className={s.player}>{isPlayingMe && <ProgressBar player={player} />}</div>
      <div className={s.date}>{new Date(track.attributes.addedAt).toLocaleDateString()}</div>
      <div className={s.actions}>
        {isReactionMutable && userData && (
          <TrackReactions id={track.id} currentUserReaction={track.attributes.currentUserReaction} />
        )}
        <IconButton>
          <MoreIcon />
        </IconButton>
        {!isTrackPublished && (
          <button onClick={() => publishTrack({ trackId: track.id })} disabled={isLoading}>
            {isLoading ? 'Publishing...' : 'Publish'}
          </button>
        )}
        <TrackDuration url={audioUrl} />
      </div>
    </div>
  )
}
