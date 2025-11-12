import clsx from 'clsx'
import { Link } from 'react-router'

import { usePlayerStore } from '@/player/model/player-store.ts'
import { TableCell, Typography } from '@/shared/components'

import s from './TrackInfoCell.module.css'

export const TrackInfoCell = ({
  image,
  title,
  artists,
  isPlaying,
  id,
  onPlayClick,
}: {
  image?: string
  title: string
  artists: string[]
  isPlaying: boolean
  id: string
  onPlayClick?: (trackId: string) => void
}) => {
  const handlePlayClick = () => {
    onPlayClick?.(id)
  }

  return (
    <TableCell>
      <div className={s.box}>
        <div className={s.image} onClick={handlePlayClick}>
          {/* todo:task extrack track cover to sepaarate component and create plceholder photo if no photo */}
          <img src={image} alt={title} />
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
