import { clsx } from 'clsx'
import * as React from 'react'

import { ReactionValue, type SchemaReactionValue } from '@/shared/api/schema.ts'
import { DislikeIcon, LikeIcon, LikeIconFill } from '@/shared/icons'
import { VU } from '@/shared/utils'

import { IconButton } from '../IconButton'
import s from './ReactionButtons.module.css'

// duplication of the CurrentUserReaction type to decouple the shared layer from the features layer
export type CurrentUserReaction = SchemaReactionValue

export interface ReactionButtonsProps {
  entityId: string
  currentReaction?: CurrentUserReaction
  onLike: (entityId: string) => void
  onDislike: (entityId: string) => void
  onRemoveReaction: (entityId: string) => void
  likesCount?: number
  className?: string
  size?: keyof typeof SIZE_MAP
}

const SIZE_MAP = {
  small: 28,
  large: 40,
}

export const ReactionButtons: React.FC<ReactionButtonsProps> = (props) => {
  const {
    entityId,
    currentReaction = ReactionValue.None,
    onLike,
    onDislike,
    onRemoveReaction,
    likesCount,
    className,
    size = 'small',
  } = props

  const isLiked = currentReaction === 1
  const isDisliked = currentReaction === -1
  const iconSize = SIZE_MAP[size]

  const setReaction = React.useCallback(
    (reaction: CurrentUserReaction) => {
      if (VU.isValid(entityId)) {
        switch (true) {
          case reaction === currentReaction:
            return onRemoveReaction?.(entityId)
          case reaction === ReactionValue.Like:
            return onLike?.(entityId)
          case reaction === ReactionValue.Dislike:
            return onDislike?.(entityId)
          default:
            return
        }
      }
    },
    [entityId, currentReaction, onRemoveReaction, onLike, onDislike]
  )

  if (!VU.isValidString(entityId)) {
    return null
  }

  return (
    <div className={clsx(s.container, className)}>
      <div className={s.likesCountBox}>
        <IconButton
          onClick={(e) => {
            e.preventDefault()

            setReaction(ReactionValue.Like)
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

          setReaction(ReactionValue.Dislike)
        }}
        className={clsx(s.button, isDisliked && s.disliked, size === 'large' && s.large)}
        aria-label={isDisliked ? 'Remove dislike' : 'Dislike'}
        type="button">
        <DislikeIcon width={iconSize} height={iconSize} />
      </IconButton>
    </div>
  )
}
