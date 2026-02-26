import clsx from 'clsx'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

import { usePlayerStore } from '@/player/model/player-store.ts'
import { CoverImage, IconButton, TableCell, Typography } from '@/shared/components'
import { PauseIcon, PlayIcon } from '@/shared/icons'

import s from './TrackInfoCell.module.css'

export const TrackInfoCell = ({
  image,
  title,
  artists,
  isPlaying,
  isHovered,
  id,
  isPublished,
  onPlayClick,
}: {
  image?: string
  title: string
  artists: string[]
  isPlaying: boolean
  isHovered: boolean
  id: string
  isPublished?: boolean
  onPlayClick?: (trackId: string) => void
}) => {
  const { t } = useTranslation()
  const handlePlayClick = () => {
    onPlayClick?.(id)
  }

  return (
    <TableCell>
      <div className={clsx(s.box, isHovered && s.boxHovered)}>
        <div className={s.image} onClick={handlePlayClick}>
          <CoverImage imageSrc={image} imageDescription={title} />
          <IconButton
            aria-label="Play track"
            className={s.playButton}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handlePlayClick()
            }}>
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
