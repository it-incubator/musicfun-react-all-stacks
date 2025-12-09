import { clsx } from 'clsx'

import { DislikeIcon, LikeIcon, LikeIconFill } from '@/shared/icons'

import { IconButton } from '../IconButton'
import s from './ReactionButtons.module.css'

// duplication of the CurrentUserReaction type to decouple the shared layer from the features layer
export enum CurrentUserReaction {
  None = 0,
  Like = 1,
  Dislike = 2,
}

export type ReactionButtonsProps = {
  reaction: CurrentUserReaction
  onLike: () => void
  onDislike: () => void
  likesCount?: number
  className?: string
  size?: keyof typeof SIZE_MAP
}

const SIZE_MAP = {
  small: 28,
  large: 40,
}

export const ReactionButtons = ({
  reaction = CurrentUserReaction.None,
  onLike,
  onDislike,
  likesCount,
  className,
  size = 'small',
}: ReactionButtonsProps) => {
  const isLiked = reaction === CurrentUserReaction.Like
  const isDisliked = reaction === CurrentUserReaction.Dislike

  const iconSize = SIZE_MAP[size]

  return (
    <div className={clsx(s.container, className)}>
      <div className={s.likesCountBox}>
        <IconButton
          onClick={(e) => {
            e.preventDefault()
            onLike()
          }}
          className={clsx(s.button, isLiked && s.liked, size === 'large' && s.large)}
          aria-label={isLiked ? 'Remove like' : 'Like'}
          type="button">
          {isLiked ? (
            <LikeIconFill width={iconSize} height={iconSize} />
          ) : (
            <LikeIcon width={iconSize} height={iconSize} />
          )}
        </IconButton>
        <span className={s.likesCount}>{likesCount}</span>
      </div>

      <IconButton
        onClick={(e) => {
          e.preventDefault()
          onDislike()
        }}
        className={clsx(s.button, isDisliked && s.disliked, size === 'large' && s.large)}
        aria-label={isDisliked ? 'Remove dislike' : 'Dislike'}
        type="button">
        <DislikeIcon width={iconSize} height={iconSize} />
      </IconButton>
    </div>
  )
}
