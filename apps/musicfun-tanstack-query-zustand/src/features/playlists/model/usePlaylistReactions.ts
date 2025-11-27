import { useEntityReactions } from '@/shared/hooks/useEntityReactions'
import { playlistsApi } from '../api/playlistsApi'
import { playlistsKeys } from '../api/query-key-factory'

export const usePlaylistReactions = (playlistId: string) =>
  useEntityReactions({
    entityId: playlistId,
    api: {
      like: playlistsApi.likePlaylist,
      dislike: playlistsApi.dislikePlaylist,
      remove: playlistsApi.removePlaylistReaction,
    },
    keys: playlistsKeys,
  })
