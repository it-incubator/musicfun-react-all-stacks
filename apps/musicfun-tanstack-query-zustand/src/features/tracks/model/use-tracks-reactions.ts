import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tracksApi } from '../api/tracksApi'
import { tracksKeys } from '../api/query-key-factory'
import type { SchemaReactionOutput } from '@/shared/api/schema'

export const useLikeTrack = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tracksApi.likeTrack,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tracksKeys.all,
      })
    },
  })
}

export const useDislikeTrack = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tracksApi.dislikeTrack,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tracksKeys.all,
      })
    },
  })
}


export const useRemoveTrackReaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tracksApi.removeTrackReaction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tracksKeys.all,
      })
    },
  })
}


export const useTrackReactions = (trackId: SchemaReactionOutput['objectId']) => {
  const like = useLikeTrack()
  const dislike = useDislikeTrack()
  const remove = useRemoveTrackReaction()

  return {
    handleLike: () => like.mutate(trackId),
    handleDislike: () => dislike.mutate(trackId),
    handleRemoveReaction: () => remove.mutate(trackId),

    isPending: like.isPending || dislike.isPending || remove.isPending,
  }
}
