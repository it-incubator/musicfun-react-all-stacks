import { useEntityReactions } from '@/shared/hooks/useEntityReactions'

import { tracksKeys } from '../api/query-key-factory'
import { tracksApi } from '../api/tracksApi'

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
