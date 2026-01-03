import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useDispatch } from 'react-redux'

import type { TrackRowData } from '@/features/tracks'
import { pause, type PlaybackState, playTrack, resume } from '@/player'
import { Progress, TableCell, TableRow, Typography } from '@/shared/components'
import { useHover } from '@/shared/hooks'
import { LiveWaveIcon } from '@/shared/icons'

import { TrackInfoCell } from '../TrackInfoCell'
import s from './TrackRow.module.css'

type TrackRowProps<T> = {
  renderActionsCell: (trackRow: T) => ReactNode
  trackRow: T
  playbackState?: PlaybackState
  playingTrackId?: string
  playingTrackProgress?: number
  onTrackPlayClick?: (trackId: string) => void
}

export const TrackRow = <T extends TrackRowData>({
  trackRow,
  playbackState,
  playingTrackId,
  playingTrackProgress,
  renderActionsCell,
  onTrackPlayClick,
}: TrackRowProps<T>) => {
  const dispatch = useDispatch()
  const [ref, isHovered] = useHover<HTMLTableRowElement>()

  const isPlaying = playingTrackId === trackRow.id && playbackState === 'playing'

  const handleTrackClick = () => {
    const { id, title, url, imageSrc, duration } = trackRow
    const isCurrentTrack = playingTrackId === id

    // nothing played
    if (!playingTrackId) {
      onTrackPlayClick?.(trackRow.id)
      dispatch(
        playTrack({
          track: { id, title, artist: '', url, duration, albumArt: imageSrc },
        })
      )
      return
    }

    // click on current track
    if (isCurrentTrack) {
      if (playbackState === 'playing') {
        dispatch(pause())
      } else if (playbackState === 'paused') {
        dispatch(resume())
      }
      return
    }

    // click on another track
    onTrackPlayClick?.(trackRow.id)
    dispatch(
      playTrack({
        track: { id, title, artist: '', url, duration, albumArt: imageSrc },
      })
    )
  }

  return (
    <TableRow ref={ref} className={clsx({ [s.active]: isPlaying })}>
      <TableCell className={clsx(isPlaying && s.playing)}>
        {isPlaying ? <LiveWaveIcon /> : trackRow.index + 1}
      </TableCell>
      <TrackInfoCell
        id={trackRow.id}
        isHovered={isHovered}
        imageSrc={trackRow.imageSrc}
        title={trackRow.title}
        artists={trackRow.artists}
        isPlaying={isPlaying}
        onTrackPlayClick={handleTrackClick}
      />
      <TableCell>
        {isPlaying && (
          <Progress
            className={s.progress}
            value={playingTrackProgress ?? 0}
            max={trackRow.duration}
          />
        )}
      </TableCell>
      <TableCell>
        <Typography variant="body2" as="time" dateTime={trackRow.addedAt}>
          {new Date(trackRow.addedAt).toLocaleDateString()}
        </Typography>
      </TableCell>
      <TableCell>
        <div className={s.actions}>{renderActionsCell(trackRow)}</div>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{trackRow.duration}</Typography>
      </TableCell>
    </TableRow>
  )
}
