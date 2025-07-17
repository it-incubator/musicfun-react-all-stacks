import { Link } from 'react-router'

import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Card, ReactionButtons, type ReactionButtonsProps, Typography } from '@/shared/components'

import s from './TrackCard.module.css'

type Props = {
  id: string
  imageSrc?: string
  title: string
  artistNames: string[]
} & Omit<ReactionButtonsProps, 'className'>

export const TrackCard = ({
  id,
  imageSrc = noCoverPlaceholder,
  title,
  artistNames,
  reaction,
  onLike,
  onDislike,
  likesCount,
}: Props) => {
  return (
    <Card as={Link} to={`/tracks/${id}`} className={s.card}>
      <div className={s.image}>
        <img src={imageSrc} alt={title} />
      </div>

      <Typography variant="h3" className={s.title}>
        {title}
      </Typography>

      <Typography variant="body3" className={s.artists}>
        {artistNames.join(', ')}
      </Typography>
      <ReactionButtons
        reaction={reaction}
        onLike={onLike}
        onDislike={onDislike}
        likesCount={likesCount}
        onUnReaction={() => {}}
      />
    </Card>
  )
}
