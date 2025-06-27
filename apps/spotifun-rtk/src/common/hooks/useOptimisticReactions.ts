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
  entityName = "элемент",
}: UseOptimisticReactionsProps<T>): UseOptimisticReactionsReturn<T> => {
  const [optimisticReaction, setOptimisticReaction] = useState(currentReaction)

  useEffect(() => {
    setOptimisticReaction(currentReaction)
  }, [currentReaction])

  const isLiked = optimisticReaction === CurrentUserReaction.Like
  const isDisliked = optimisticReaction === CurrentUserReaction.Dislike

  const executeWithRollback = async (
    newReaction: CurrentUserReaction,
    mutation: () => Promise<T>,
  ): Promise<T | undefined> => {
    const previousReaction = optimisticReaction
    setOptimisticReaction(newReaction)

    try {
      return await mutation()
    } catch (error) {
      setOptimisticReaction(previousReaction)
      showErrorToast(`Ошибка при обновлении реакции для ${entityName}`, error)
      return undefined
    }
  }

  const handleLike = () =>
    executeWithRollback(
      isLiked ? CurrentUserReaction.None : CurrentUserReaction.Like,
      isLiked ? mutations.remove : mutations.like,
    )

  const handleDislike = () =>
    executeWithRollback(
      isDisliked ? CurrentUserReaction.None : CurrentUserReaction.Dislike,
      isDisliked ? mutations.remove : mutations.dislike,
    )

  return {
    optimisticReaction,
    isLiked,
    isDisliked,
    handleLike,
    handleDislike,
  }
}
