import { useEntityReactions } from '@/shared/hooks/useEntityReactions'
import { tracksApi } from '../api/tracksApi'
import { tracksKeys } from '../api/query-key-factory'

export const useTrackReactions = (trackId: string) =>
  useEntityReactions({
    entityId: trackId,
    api: {
      like: tracksApi.likeTrack,
      dislike: tracksApi.dislikeTrack,
      remove: tracksApi.removeTrackReaction,
    },
    keys: tracksKeys,
  })
