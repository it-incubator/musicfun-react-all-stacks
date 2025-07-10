import { Link } from 'react-router'

import {
  useDislikePlaylistMutation,
  useLikePlaylistMutation,
  useUnReactionPlaylistMutation,
} from '@/features/playlists'
import { Card, CurrentUserReaction, ReactionButtons, Typography } from '@/shared/components'

import s from './PlaylistCard.module.css'

type PlaylistCardPropsBase = {
  id: string
  title: string
  image: string
  description: string
}

type PlaylistCardPropsWithReactions = PlaylistCardPropsBase & {
  isShowReactionButtons: true
  reaction: CurrentUserReaction
  likesCount: number
}

type PlaylistCardPropsWithoutReactions = PlaylistCardPropsBase & {
  isShowReactionButtons?: false
}

type PlaylistCardProps = PlaylistCardPropsWithReactions | PlaylistCardPropsWithoutReactions

export const PlaylistCard = ({
  title,
  image,
  description,
  id,
  isShowReactionButtons,
  ...props
}: PlaylistCardProps) => {
  const [like] = useLikePlaylistMutation()
  const [dislike] = useDislikePlaylistMutation()
  const [unReaction] = useUnReactionPlaylistMutation()

  return (
    <Card as={Link} to={`/playlists/${id}`} className={s.card}>
      <div className={s.image}>
        <img src={image} alt="" aria-hidden />
      </div>
      <Typography variant="h3" className={s.title}>
        {title}
      </Typography>
      <Typography variant="body3" className={s.description}>
        {description}
      </Typography>
      {/*  'reaction' in props — Type guard for correct type checking */}
      {isShowReactionButtons && 'reaction' in props && (
        <ReactionButtons
          reaction={props.reaction}
          onLike={() => like({ id })}
          onDislike={() => dislike({ id })}
          likesCount={props.likesCount}
          onUnReaction={() => unReaction({ id })}
        />
      )}
    </Card>
  )
}
