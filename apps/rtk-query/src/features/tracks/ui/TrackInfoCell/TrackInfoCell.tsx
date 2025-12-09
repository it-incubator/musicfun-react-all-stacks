import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'

import { playTrack } from '@/player'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { TableCell, Typography } from '@/shared/components'

import s from './TrackInfoCell.module.css'

export const TrackInfoCell = ({
  imageSrc = noCoverPlaceholder,
  title,
  artists,
  isPlaying,
  id,
  onTrackPlayClick,
  url,
}: {
  imageSrc?: string
  title: string
  artists: string[]
  isPlaying: boolean
  id: string
  onTrackPlayClick?: (trackId: string) => void
  url: string
}) => {
  const dispatch = useDispatch()
  const handleImageClick = () => {
    onTrackPlayClick?.(id)
    // TODO: Update to pass full track object with url
    dispatch(
      playTrack({ track: { id, title, artist: '', url, duration: 100, albumArt: imageSrc } })
    )
  }

  return (
    <TableCell>
      <div className={s.box}>
        <div className={s.image}>
          <img src={imageSrc} alt={title} onClick={handleImageClick} />
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
