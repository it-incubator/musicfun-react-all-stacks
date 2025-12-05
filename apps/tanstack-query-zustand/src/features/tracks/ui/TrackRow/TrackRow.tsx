import clsx from 'clsx'
import * as React from 'react'

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
  onPlayClick,
}: {
  renderActionsCell: (trackRow: T) => React.ReactNode
  trackRow: T
  playingTrackId?: string
  playingTrackProgress?: number
  onPlayClick?: (trackId: string) => void
}) => {
  const isPlaying = playingTrackId === trackRow.id

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement
    if (
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('svg') ||
      target.closest('input') ||
      target.closest('a')
    ) {
      return
    }

    onPlayClick?.(trackRow.id)
  }

  return (
    <TableRow onClick={handleRowClick} className={s.tableRow}>
      <TableCell className={clsx(isPlaying && s.playing)}>
        {isPlaying ? <LiveWaveIcon /> : trackRow.index + 1}
      </TableCell>
      <TrackInfoCell
        id={trackRow.id}
        image={trackRow.image}
        title={trackRow.title}
        artists={trackRow.artists}
        isPlaying={isPlaying}
        onPlayClick={onPlayClick}
      />
      <TableCell>
        {isPlaying && (
          <Progress
            key={`${trackRow.id}-${playingTrackProgress}`}
            className={s.progress}
            // Todo: add duration in tracksRow component for correct progress bar & duration visibility
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
        {/* // Todo: add duration in tracksRow component for correct progress bar & duration visibility */}
        <Typography variant="body2">{trackRow.duration}</Typography>
      </TableCell>
    </TableRow>
  )
}
