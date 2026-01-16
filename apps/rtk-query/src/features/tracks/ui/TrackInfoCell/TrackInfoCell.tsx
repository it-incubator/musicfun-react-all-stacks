import clsx from 'clsx'
import { Link } from 'react-router'

import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { TableCell, Typography } from '@/shared/components'
import { PauseIcon, PlayIcon } from '@/shared/icons'

import s from './TrackInfoCell.module.css'

type TrackInfoCellProps = {
  imageSrc?: string
  isHovered: boolean
  title: string
  artists: string[]
  isPlaying: boolean
  id: string
  onTrackPlayClick?: (trackId: string) => void
}

export const TrackInfoCell = ({
  imageSrc = noCoverPlaceholder,
  title,
  artists,
  isHovered,
  isPlaying,
  id,
  onTrackPlayClick,
}: TrackInfoCellProps) => {
  return (
    <TableCell>
      <div className={clsx(s.box, { [s.boxHovered]: isHovered })}>
        <div className={s.image}>
          <img src={imageSrc} alt={title} />
          <button
            aria-label="Play track"
            className={s.playButton}
            type="button"
            onClick={() => onTrackPlayClick?.(id)}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
        <div className={s.info}>
          <Typography
            variant="body1"
            as={Link}
            className={clsx(s.title, isPlaying && s.playing)}
            to={`/tracks/${id}`}>
            {title}
          </Typography>
          <Typography className={s.artists} variant="body2">
            {artists.join(', ')}
          </Typography>
        </div>
      </div>
    </TableCell>
  )
}
