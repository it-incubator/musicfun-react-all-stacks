import { type Query, type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'

import type {
  SchemaGetTrackListOutput,
  SchemaReactionOutput,
  SchemaTrackListItemResource,
} from '@/shared/api/schema'
import { tracksKeys } from '@/features/tracks/api/query-key-factory.ts'

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

type Track = SchemaTrackListItemResource
type TrackPage = SchemaGetTrackListOutput

export function useEntityReactions({ entityId, api, keys }: UseEntityReactionsConfig) {
  const queryClient = useQueryClient()

  const commonOptimisticUpdate = async (action: 'like' | 'dislike' | 'remove') => {
    const tracksInfinitePredicate = (query: Query) => {
      const queryKey = query.queryKey
      return (
        queryKey[0] === tracksKeys.all[0] && queryKey[1] === 'list' && queryKey[2] === 'infinite'
      )
    }

    await queryClient.cancelQueries({ predicate: tracksInfinitePredicate })

    const previousData = queryClient
      .getQueryCache()
      .findAll({
        predicate: tracksInfinitePredicate,
      })
      .map((q) => ({
        key: q.queryKey,
        data: queryClient.getQueryData<any>(q.queryKey),
      }))

    previousData.forEach(({ key }) => {
      queryClient.setQueryData<{
        pages: TrackPage[]
        pageParams: any[]
      }>(key, (old) => {
        if (!old?.pages) return old

        return {
          ...old,
          pages: old.pages.map((page: TrackPage) => ({
            ...page,
            data: page.data.map((track: Track) => {
              if (track.id !== entityId) return track

              const currentReaction = track.attributes.currentUserReaction ?? 0
              let likesCount = track.attributes.likesCount ?? 0
              let newReaction = currentReaction

              if (action === 'like') {
                if (currentReaction === 1) {
                  likesCount -= 1
                  newReaction = 0
                } else {
                  if (currentReaction === -1) {
                    likesCount += 1
                  } else {
                    likesCount += 1
                  }
                  newReaction = 1
                }
              } else if (action === 'dislike') {
                if (currentReaction === -1) {
                  newReaction = 0
                } else {
                  if (currentReaction === 1) {
                    likesCount -= 1
                  }
                  newReaction = -1
                }
              } else if (action === 'remove') {
                if (currentReaction === 1) {
                  likesCount -= 1
                }

                newReaction = 0
              }

              return {
                ...track,
                attributes: {
                  ...track.attributes,
                  likesCount,
                  currentUserReaction: newReaction,
                },
              }
            }),
          })),
        }
      })
    })

    return { previousData }
  }

  const commonErrorHandler = (
    context: { previousData?: Array<{ key: QueryKey; data: any }> } | undefined
  ) => {
    if (context?.previousData) {
      context.previousData.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data)
      })
    }
  }

  const commonSuccessHandler = () => {
    queryClient.invalidateQueries({
      queryKey: keys.all,
    })
  }

  const like = useMutation({
    mutationFn: () => api.like(entityId),
    onMutate: () => commonOptimisticUpdate('like'),
    onError: commonErrorHandler,
    onSuccess: commonSuccessHandler,
  })

  const dislike = useMutation({
    mutationFn: () => api.dislike(entityId),
    onMutate: () => commonOptimisticUpdate('dislike'),
    onError: commonErrorHandler,
    onSuccess: commonSuccessHandler,
  })

  const remove = useMutation({
    mutationFn: () => api.remove(entityId),
    onMutate: () => commonOptimisticUpdate('remove'),
    onError: commonErrorHandler,
    onSuccess: commonSuccessHandler,
  })

  return {
    handleLike: () => (like.mutate as () => void)(),
    handleDislike: () => (dislike.mutate as () => void)(),
    handleRemoveReaction: () => (remove.mutate as () => void)(),
    isPending: like.isPending || dislike.isPending || remove.isPending,
  }
}
