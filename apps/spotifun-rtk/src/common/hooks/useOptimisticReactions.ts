import { useState, useEffect } from "react"
import { CurrentUserReaction } from "@/common/enums"
import { showErrorToast } from "@/common/utils"

type ReactionMutations<T = unknown> = {
  like: () => Promise<T>
  dislike: () => Promise<T>
  remove: () => Promise<T>
}

type UseOptimisticReactionsProps<T = unknown> = {
  currentReaction: CurrentUserReaction
  mutations: ReactionMutations<T>
  entityName?: string
}

type UseOptimisticReactionsReturn<T = unknown> = {
  optimisticReaction: CurrentUserReaction
  isLiked: boolean
  isDisliked: boolean
  handleLike: () => Promise<T | undefined>
  handleDislike: () => Promise<T | undefined>
}

export const useOptimisticReactions = <T = unknown>({
  currentReaction,
  mutations,
  entityName = "элемент"
}: UseOptimisticReactionsProps<T>): UseOptimisticReactionsReturn<T> => {
  const [optimisticReaction, setOptimisticReaction] = useState(currentReaction)

  useEffect(() => {
    setOptimisticReaction(currentReaction)
  }, [currentReaction])

  const isLiked = optimisticReaction === CurrentUserReaction.Like
  const isDisliked = optimisticReaction === CurrentUserReaction.Dislike

  const handleLike = async (): Promise<T | undefined> => {
    const previousReaction = optimisticReaction

    try {
      if (isLiked) {
        setOptimisticReaction(CurrentUserReaction.None)
        return await mutations.remove()
      } else {
        setOptimisticReaction(CurrentUserReaction.Like)
        return await mutations.like()
      }
    } catch (error) {
      setOptimisticReaction(previousReaction)
      showErrorToast(`Ошибка при обновлении лайка для ${entityName}`, error)
      return undefined
    }
  }

  const handleDislike = async (): Promise<T | undefined> => {
    const previousReaction = optimisticReaction

    try {
      if (isDisliked) {
        setOptimisticReaction(CurrentUserReaction.None)
        return await mutations.remove()
      } else {
        setOptimisticReaction(CurrentUserReaction.Dislike)
        return await mutations.dislike()
      }
    } catch (error) {
      setOptimisticReaction(previousReaction)
      showErrorToast(`Ошибка при обновлении дизлайка для ${entityName}`, error)
      return undefined
    }
  }

  return {
    optimisticReaction,
    isLiked,
    isDisliked,
    handleLike,
    handleDislike,
  }
} 