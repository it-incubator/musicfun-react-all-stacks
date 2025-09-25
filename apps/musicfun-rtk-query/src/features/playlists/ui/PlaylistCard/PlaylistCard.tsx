import clsx from 'clsx'
import { Link } from 'react-router'

import {
  useDislikePlaylistMutation,
  useLikePlaylistMutation,
  useUnReactionPlaylistMutation,
} from '@/features/playlists'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Card, CurrentUserReaction, ReactionButtons, Typography } from '@/shared/components'

import s from './PlaylistCard.module.css'

type PlaylistCardPropsBase = {
  id: string
  title: string
  imageSrc?: string
  description: string
  actions?: React.ReactNode
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
  imageSrc = noCoverPlaceholder,
  description,
  id,
  isShowReactionButtons,
  actions,
  ...props
}: PlaylistCardProps) => {
  const [like] = useLikePlaylistMutation()
  const [dislike] = useDislikePlaylistMutation()
  const [unReaction] = useUnReactionPlaylistMutation()

  return (
    <Card
      as={Link}
      to={`/playlists/${id}`}
      className={clsx(s.card, isShowReactionButtons && s.withReactionButtons)}>
      <div className={s.image}>
        <img src={imageSrc} alt="" aria-hidden />
      </div>
      <div className={s.header}>
        <Typography variant="h3" className={s.title}>
          {title}
        </Typography>
        {actions}
      </div>
      <Typography variant="body3" className={s.description}>
        {description}
      </Typography>
      {/*  'reaction' in props — Type guard for correct type checking */}
      {isShowReactionButtons && 'reaction' in props && (
        <ReactionButtons
          className={s.reactionButtons}
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
