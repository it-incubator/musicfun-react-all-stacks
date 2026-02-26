import clsx from 'clsx'
import { Link } from 'react-router'

import { useTranslation } from 'react-i18next'

import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { IconButton, TableCell, Typography } from '@/shared/components'
import { PauseIcon, PlayIcon } from '@/shared/icons'

import s from './TrackInfoCell.module.css'

type TrackInfoCellProps = {
  imageSrc?: string
  isHovered: boolean
  title: string
  artists: string[]
  isPlaying: boolean
  isPublished?: boolean
  id: string
  onTrackPlayClick?: (trackId: string) => void
}

export const TrackInfoCell = ({
  imageSrc = noCoverPlaceholder,
  title,
  artists,
  isHovered,
  isPlaying,
  isPublished,
  id,
  onTrackPlayClick,
}: TrackInfoCellProps) => {
  const { t } = useTranslation()

  return (
    <TableCell>
      <div className={clsx(s.box, { [s.boxHovered]: isHovered })}>
        <div className={s.image}>
          <img src={imageSrc} alt={title} />
          <IconButton
            aria-label="Play track"
            className={s.playButton}
            type="button"
            onClick={() => onTrackPlayClick?.(id)}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
        </div>
        <div className={s.info}>
          <div className={s.titleRow}>
            <Typography
              variant="body1"
              as={Link}
              className={clsx(s.title, isPlaying && s.playing)}
              to={`/tracks/${id}`}>
              {title}
            </Typography>
            {isPublished === false && (
              <span className={s.draftBadge}>{t('tracks.button.draft')}</span>
            )}
          </div>
          <Typography className={s.artists} variant="body2">
            {artists.length > 0 ? artists.join(', ') : t('player.unknown_artist')}
          </Typography>
        </div>
      </div>
    </TableCell>
  )
}
