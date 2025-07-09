import { Link } from 'react-router'

import { Card, ReactionButtons, type ReactionButtonsProps, Typography } from '@/shared/components'

import s from './TrackCard.module.css'

type Props = {
  id: string
  image: string
  title: string
  artists: string
} & Omit<ReactionButtonsProps, 'className'>

export const TrackCard = ({
  id,
  image,
  title,
  artists,
  reaction,
  onLike,
  onDislike,
  likesCount,
}: Props) => {
  return (
    <Card as={Link} to={`/tracks/${id}`} className={s.card}>
      <div className={s.image}>
        <img src={image} alt={title} />
      </div>

      <Typography variant="h3" className={s.title}>
        {title}
      </Typography>

      <Typography variant="body3" className={s.artists}>
        {artists}
      </Typography>
      <ReactionButtons
        reaction={reaction}
        onLike={onLike}
        onDislike={onDislike}
        likesCount={likesCount}
      />
    </Card>
  )
}
