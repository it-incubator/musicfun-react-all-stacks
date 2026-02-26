import clsx from 'clsx'
import type { ReactNode } from 'react'

import type { TrackRowData } from '@/features/tracks'
import { useCurrentTrack, usePlaybackProgress } from '@/player'
import { Progress, TableCell, TableRow, Typography } from '@/shared/components'
import { useHover } from '@/shared/hooks'
import { LiveWaveIcon, StaticWaveIcon } from '@/shared/icons'

import { TrackInfoCell } from '../TrackInfoCell'
import s from './TrackRow.module.css'

type TrackRowProps<T> = {
  renderActionsCell: (trackRow: T) => ReactNode
  trackRow: T
  onTrackPlayClick?: (trackId: string) => void
}

export const TrackRow = <T extends TrackRowData>({
  trackRow,
  renderActionsCell,
  onTrackPlayClick,
}: TrackRowProps<T>) => {
  const [ref, isHovered] = useHover<HTMLTableRowElement>()

  const { trackId, isPlaying } = useCurrentTrack()

  const { progress } = usePlaybackProgress()
  const isPlayerTrack = trackRow.id === trackId

  const isTrackRowPlaying = isPlayerTrack && isPlaying
  const isTrackSelected = isPlayerTrack && !isPlaying

  const getTableCellIcon = () => {
    if (isTrackRowPlaying) return <LiveWaveIcon />
    if (isTrackSelected) return <StaticWaveIcon />

    return trackRow.index + 1
  }

  return (
    <TableRow
      ref={ref}
      className={clsx({
        [s.active]: isTrackRowPlaying,
        [s.draft]: trackRow.isPublished === false,
      })}>
      <TableCell className={clsx(isPlayerTrack && s.playing)}>{getTableCellIcon()}</TableCell>
      <TrackInfoCell
        id={trackRow.id}
        isHovered={isHovered}
        imageSrc={trackRow.imageSrc}
        title={trackRow.title}
        artists={trackRow.artists}
        isPlaying={isTrackRowPlaying}
        isPublished={trackRow.isPublished}
        onTrackPlayClick={onTrackPlayClick}
      />
      <TableCell>
        {isTrackRowPlaying && (
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
