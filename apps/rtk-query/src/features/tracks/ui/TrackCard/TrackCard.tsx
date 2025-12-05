import { Link } from 'react-router'

import {
  useDislikeTrackMutation,
  useLikeTrackMutation,
  useUnReactionTrackMutation,
} from '@/features/tracks'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Card, ReactionButtons, Typography } from '@/shared/components'
import type { CurrentUserReaction } from '@/shared/types'

import s from './TrackCard.module.css'

type Props = {
  id: string
  imageSrc?: string
  title: string
  artistNames: string[]
  reaction: CurrentUserReaction
  likesCount: number
}

export const TrackCard = ({
  id,
  imageSrc = noCoverPlaceholder,
  title,
  artistNames,
  reaction,
  likesCount,
}: Props) => {
  const [like] = useLikeTrackMutation()
  const [dislike] = useDislikeTrackMutation()
  const [unReaction] = useUnReactionTrackMutation()

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
        onLike={() => like({ trackId: id })}
        onDislike={() => dislike({ trackId: id })}
        likesCount={likesCount}
        onUnReaction={() => unReaction({ trackId: id })}
      />
    </Card>
  )
}
