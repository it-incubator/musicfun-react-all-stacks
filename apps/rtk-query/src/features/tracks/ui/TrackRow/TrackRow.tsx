import clsx from 'clsx'
import type { ReactNode } from 'react'

import type { TrackRowData } from '@/features/tracks'
import { Progress, TableCell, TableRow, Typography } from '@/shared/components'
import { useHover } from '@/shared/hooks'
import { LiveWaveIcon } from '@/shared/icons'

import { TrackInfoCell } from '../TrackInfoCell'
import s from './TrackRow.module.css'

type TrackRowProps<T> = {
  renderActionsCell: (trackRow: T) => ReactNode
  trackRow: T
  isPlaying: boolean
  playingTrackId?: string
  playingTrackProgress?: number
  onTrackPlayClick?: (trackId: string) => void
}

export const TrackRow = <T extends TrackRowData>({
  trackRow,
  isPlaying,
  playingTrackProgress,
  renderActionsCell,
  onTrackPlayClick,
}: TrackRowProps<T>) => {
  const [ref, isHovered] = useHover<HTMLTableRowElement>()

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
        onTrackPlayClick={onTrackPlayClick}
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
