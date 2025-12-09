import { Link } from 'react-router'

import {
  Card,
  CoverImage,
  ReactionButtons,
  type ReactionButtonsProps,
  Typography,
} from '@/shared/components'

import s from './TrackCard.module.css'

type Props = {
  id: string
  image: string
  title: string
  artists: string
} & Omit<ReactionButtonsProps, 'className' | 'entityId'>

export const TrackCard = ({
  id,
  image,
  title,
  artists,
  currentReaction,
  onRemoveReaction,
  onLike,
  onDislike,
  likesCount,
}: Props) => {
  return (
    <Card as={Link} to={`/tracks/${id}`} className={s.card}>
      <div className={s.image}>
        <CoverImage imageSrc={image} imageDescription={title} />
      </div>

      <Typography variant="h3" className={s.title}>
        {title}
      </Typography>

      <Typography variant="body3" className={s.artists}>
        {artists}
      </Typography>
      <ReactionButtons
        currentReaction={currentReaction}
        entityId={id}
        likesCount={likesCount}
        onDislike={onDislike}
        onLike={onLike}
        onRemoveReaction={onRemoveReaction}
      />
    </Card>
  )
}
