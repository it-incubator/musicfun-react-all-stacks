import { Link } from 'react-router'

import type { PlaylistImagesOutputDTO } from '@/features/playlists/api/types.ts'
import { Card, ReactionButtons, type ReactionButtonsProps, Typography } from '@/shared/components'

import stab from '../../../../assets/img/no-cover.png'
import s from './PlaylistCard.module.css'

type PlaylistCardPropsBase = {
  id: string
  title: string
  images: PlaylistImagesOutputDTO
  description: string | null
}

type PlaylistCardPropsWithReactions = PlaylistCardPropsBase & {
  isShowReactionButtons: true
} & Omit<ReactionButtonsProps, 'className'>

type PlaylistCardPropsWithoutReactions = PlaylistCardPropsBase & {
  isShowReactionButtons?: false
}

type PlaylistCardProps = PlaylistCardPropsWithReactions | PlaylistCardPropsWithoutReactions

export const PlaylistCard = ({
  title,
  images,
  description,
  id,
  isShowReactionButtons,
  ...props
}: PlaylistCardProps) => {
  let imageSrc = images?.main?.length ? images.main[0].url : undefined

  if (!imageSrc) {
    imageSrc = stab
  }

  return (
    <Card as={Link} to={`/playlists/${id}`} className={s.card}>
      <div className={s.image}>
        <img src={imageSrc} alt="" aria-hidden />
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
          onLike={props.onLike}
          onDislike={props.onDislike}
          likesCount={props.likesCount}
        />
      )}
    </Card>
  )
}
