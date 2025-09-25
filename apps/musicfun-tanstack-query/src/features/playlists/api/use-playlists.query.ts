import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { playlistsApi } from '@/features/playlists/api/playlistsApi.ts'
import { playlistsKeys } from '@/features/playlists/api/query-key-factory.ts'
import { getClient } from '@/shared/api/client.ts'
import type { SchemaGetPlaylistsRequestPayload, SchemaReactionOutput } from '@/shared/api/schema.ts'
import { VU } from '@/shared/utils'

export const usePlaylists = ({
  search,
  pageNumber,
  pageSize,
  userId,
  sortBy,
  sortDirection,
  tagsIds,
  trackId,
}: SchemaGetPlaylistsRequestPayload) => {
  const query = useQuery({
    queryKey: playlistsKeys.list({
      search,
      pageNumber,
      pageSize,
      userId,
      sortBy,
      sortDirection,
      tagsIds,
      trackId,
    }),
    queryFn: () => {
      return getClient().GET('/playlists', {
        params: {
          query: {
            search: search || void 0,
            pageNumber,
            pageSize,
            userId,
            sortBy,
            sortDirection,
            tagsIds: VU.isValid(tagsIds) ? tagsIds : void 0,
            trackId,
          },
        },
      })
    },
    placeholderData: keepPreviousData,
  })

  return query
}

export const useLikePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: playlistsApi.likePlaylist,
    onSuccess: () => {
      // Invalidate all playlist queries to refresh data
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
    },
    onError: (error) => {
      console.error('Failed to like playlist:', error)
      // Here you can add user notification about the error
    },
  })
}

export const useDislikePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: playlistsApi.dislikePlaylist,
    onSuccess: () => {
      // Invalidate all playlist queries to refresh data
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
    },
    onError: (error) => {
      console.error('Failed to dislike playlist:', error)
      // Here you can add user notification about the error
    },
  })
}

export const useRemovePlaylistReaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: playlistsApi.removePlaylistReaction,
    onSuccess: () => {
      // Invalidate all playlist queries to refresh data
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
    },
    onError: (error) => {
      console.error('Failed to remove playlist reaction:', error)
      // Here you can add user notification about the error
    },
  })
}

// Hook for managing playlist reactions
export const usePlaylistReactions = (playlistId: SchemaReactionOutput['objectId']) => {
  const likeMutation = useLikePlaylist()
  const dislikeMutation = useDislikePlaylist()
  const removeMutation = useRemovePlaylistReaction()

  const handleLike = () => {
    likeMutation.mutate(playlistId)
  }

  const handleDislike = () => {
    dislikeMutation.mutate(playlistId)
  }

  const handleRemoveReaction = () => {
    removeMutation.mutate(playlistId)
  }

  return {
    handleLike,
    handleDislike,
    handleRemoveReaction,
    isPending: likeMutation.isPending || dislikeMutation.isPending || removeMutation.isPending,
  }
}
