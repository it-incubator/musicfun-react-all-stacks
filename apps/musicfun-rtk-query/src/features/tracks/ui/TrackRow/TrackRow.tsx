import clsx from 'clsx'
import type { ReactNode } from 'react'

import type { TrackRowData } from '@/features/tracks'
import { Progress, TableCell, TableRow, Typography } from '@/shared/components'
import { LiveWaveIcon } from '@/shared/icons'

import { TrackInfoCell } from '../TrackInfoCell'
import s from './TrackRow.module.css'

export const TrackRow = <T extends TrackRowData>({
  trackRow,
  playingTrackId,
  playingTrackProgress,
  renderActionsCell,
  onTrackPlayClick,
}: {
  renderActionsCell: (trackRow: T) => ReactNode
  trackRow: T
  playingTrackId?: string
  playingTrackProgress?: number
  onTrackPlayClick?: (trackId: string) => void
}) => {
  const isPlaying = playingTrackId === trackRow.id

  return (
    <TableRow>
      <TableCell className={clsx(isPlaying && s.playing)}>
        {isPlaying ? <LiveWaveIcon /> : trackRow.index + 1}
      </TableCell>
      <TrackInfoCell
        id={trackRow.id}
        imageSrc={trackRow.imageSrc}
        title={trackRow.title}
        artists={trackRow.artists}
        isPlaying={isPlaying}
        onTrackPlayClick={onTrackPlayClick}
        url={trackRow.url}
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
