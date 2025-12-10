import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { SchemaReactionOutput } from '@/shared/api/schema'
import {tracksKeys} from "@/features/tracks/api/query-key-factory.ts";

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
    mutationFn: (id: string) => api.like(id),

    onMutate: async (id: string) => {

      const tracksInfinitePredicate = (q: any) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === 'tracks' &&
          q.queryKey[1] === 'list' &&
          q.queryKey[2] === 'infinite'


      await queryClient.cancelQueries({ predicate: tracksInfinitePredicate })

      const previousData = queryClient
          .getQueryCache()
          .findAll({
            predicate: tracksInfinitePredicate
          })
          .map((q) => ({
            key: q.queryKey,
            data: queryClient.getQueryData<any>(q.queryKey),
          }))


      previousData.forEach(({ key }) => {
        queryClient.setQueryData<any>(key, (old) => {
          if (!old?.pages) return old

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((track: any) => {
                if (track.id !== id) return track

                const currentReaction = track.attributes.currentUserReaction ?? 0
                let likesCount = track.attributes.likesCount ?? 0
                let dislikesCount = track.attributes.dislikesCount ?? 0


                if (currentReaction === 1) {
                  likesCount -= 1
                  return {
                    ...track,
                    attributes: {
                      ...track.attributes,
                      likesCount,
                      currentUserReaction: 0,
                    },
                  }
                }


                if (currentReaction === -1) {
                  likesCount += 1
                  dislikesCount -= 1
                } else {
                  likesCount += 1
                }

                return {
                  ...track,
                  attributes: {
                    ...track.attributes,
                    likesCount,
                    dislikesCount,
                    currentUserReaction: 1,
                  },
                }
              }),
            })),
          }
        })
      })

      return { previousData }
    },

    onError: (_err, _vars, context) => {
      context?.previousData?.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data)
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.all
      })
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
    handleLike: () => like.mutate(entityId),
    handleDislike: () => dislike.mutate(),
    handleRemoveReaction: () => remove.mutate(),

    isPending: like.isPending || dislike.isPending || remove.isPending,
  }
}
