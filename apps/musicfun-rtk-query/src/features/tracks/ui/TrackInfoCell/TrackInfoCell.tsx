import clsx from 'clsx'
import { Link } from 'react-router'

import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { TableCell, Typography } from '@/shared/components'

import s from './TrackInfoCell.module.css'

export const TrackInfoCell = ({
  imageSrc = noCoverPlaceholder,
  title,
  artists,
  isPlaying,
  id,
}: {
  imageSrc?: string
  title: string
  artists: string[]
  isPlaying: boolean
  id: string
}) => {
  return (
    <TableCell>
      <div className={s.box}>
        <div className={s.image}>
          <img src={imageSrc} alt={title} />
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
