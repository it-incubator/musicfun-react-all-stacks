import type { FC, ReactNode } from 'react'
import { useCallback } from 'react'

export type ReactionValue = 1 | -1 | 0

export interface ReactionProviderProps {
  entityId: string
  currentReaction?: ReactionValue
  onLike: (entityId: string) => void
  onDislike: (entityId: string) => void
  onRemoveReaction: (entityId: string) => void
  children: (props: {
    reaction: ReactionValue
    onLike: () => void
    onDislike: () => void
    likesCount?: number
  }) => ReactNode
  likesCount?: number
}

enum ReactionType {
  Like = 1,
  Dislike = -1,
}

export const ReactionProvider: FC<ReactionProviderProps> = (props) => {
  const {
    entityId,
    currentReaction = 0,
    onLike,
    onDislike,
    onRemoveReaction,
    children,
    likesCount,
  } = props

  const toggleReaction = useCallback(
    (reactionType: ReactionValue) => {
      switch (true) {
        case currentReaction === reactionType:
          return onRemoveReaction(entityId)
        case reactionType === ReactionType.Like:
          return onLike(entityId)
        case reactionType === ReactionType.Dislike:
          return onDislike(entityId)
        default:
          return
      }
    },
    [currentReaction, onDislike, onLike, onRemoveReaction, entityId]
  )

  const handleLike = useCallback(() => {
    toggleReaction(ReactionType.Like)
  }, [toggleReaction])

  const handleDislike = useCallback(() => {
    toggleReaction(ReactionType.Dislike)
  }, [toggleReaction])

  return (
    <>
      {children({
        reaction: currentReaction,
        onLike: handleLike,
        onDislike: handleDislike,
        likesCount,
      })}
    </>
  )
}
