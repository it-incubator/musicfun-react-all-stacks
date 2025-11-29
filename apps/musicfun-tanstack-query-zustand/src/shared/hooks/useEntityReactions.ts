import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SchemaReactionOutput } from '@/shared/api/schema'

interface UseEntityReactionsConfig {
  entityId: SchemaReactionOutput['objectId']
  keys: {
    all: readonly unknown[]
  }
  api: {
    like: (id: string) => Promise<any>
    dislike: (id: string) => Promise<any>
    remove: (id: string) => Promise<any>
  }
}

export function useEntityReactions({ entityId, api, keys }: UseEntityReactionsConfig) {
  const queryClient = useQueryClient()

  const like = useMutation({
    mutationFn: () => api.like(entityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })

  const dislike = useMutation({
    mutationFn: () => api.dislike(entityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })

  const remove = useMutation({
    mutationFn: () => api.remove(entityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })

  return {
    handleLike: () => like.mutate(),
    handleDislike: () => dislike.mutate(),
    handleRemoveReaction: () => remove.mutate(),

    isPending: like.isPending || dislike.isPending || remove.isPending,
  }
}
