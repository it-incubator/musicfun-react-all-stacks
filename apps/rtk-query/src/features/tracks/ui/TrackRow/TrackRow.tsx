import clsx from 'clsx'
import type { ReactNode } from 'react'

import type { TrackRowData } from '@/features/tracks'
import { useCurrentTrack, usePlaybackProgress } from '@/player'
import { Progress, TableCell, TableRow, Typography } from '@/shared/components'
import { LiveWaveIcon, StaticWaveIcon } from '@/shared/icons'

import { TrackInfoCell } from '../TrackInfoCell'
import s from './TrackRow.module.css'

export const TrackRow = <T extends TrackRowData>({
  trackRow,
  renderActionsCell,
  onTrackPlayClick,
}: {
  renderActionsCell: (trackRow: T) => ReactNode
  trackRow: T
  onTrackPlayClick?: (trackId: string) => void
}) => {
  const { trackId, isPlaying } = useCurrentTrack()
  const { progress } = usePlaybackProgress()

  const isPlayerTrack = trackRow.id === trackId
  const isTrackRowPlaying = isPlayerTrack && isPlaying
  const tableCellIcon = isTrackRowPlaying ? (
    <LiveWaveIcon />
  ) : isPlayerTrack ? (
    <StaticWaveIcon />
  ) : (
    trackRow.index + 1
  )

  return (
    <TableRow>
      <TableCell className={clsx(isPlayerTrack && s.playing)}>{tableCellIcon}</TableCell>
      <TrackInfoCell
        id={trackRow.id}
        imageSrc={trackRow.imageSrc}
        title={trackRow.title}
        artists={trackRow.artists}
        isPlaying={isPlayerTrack}
        onTrackPlayClick={onTrackPlayClick}
      />
      <TableCell>
        {isPlayerTrack && (
          <Progress className={s.progress} value={progress ?? 0} max={trackRow.duration} />
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
