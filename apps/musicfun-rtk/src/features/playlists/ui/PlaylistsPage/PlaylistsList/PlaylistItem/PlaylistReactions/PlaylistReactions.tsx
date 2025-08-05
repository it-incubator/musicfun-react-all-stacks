import { CurrentUserReaction } from '@/common/enums'
import { useOptimisticReactions } from '@/common/hooks'
import { DislikeIcon } from '@/common/icons/DislikeIcon/DislikeIcon.tsx'
import { LikeIcon } from '@/common/icons/LikeIcon/LikeIcon.tsx'
import {
  useDislikePlaylistMutation,
  useLikePlaylistMutation,
  useUnReactionPlaylistMutation,
} from '@/features/playlists/api/playlistsApi'

type Props = {
  id: string
  currentUserReaction: CurrentUserReaction
}

export const PlaylistReactions = ({ id, currentUserReaction }: Props) => {
  const [likePlaylist] = useLikePlaylistMutation()
  const [unReactionPlaylist] = useUnReactionPlaylistMutation()
  const [dislikePlaylist] = useDislikePlaylistMutation()

  const { isLiked, isDisliked, handleLike, handleDislike } = useOptimisticReactions({
    currentReaction: currentUserReaction,
    mutations: {
      like: () => likePlaylist({ id }).unwrap(),
      dislike: () => dislikePlaylist({ id }).unwrap(),
      remove: () => unReactionPlaylist({ id }).unwrap(),
    },
  })

  return (
    <div style={{ display: 'flex' }}>
      <button className={'btn'} onClick={handleLike}>
        <LikeIcon type={isLiked ? 'like' : 'neutral'} />
      </button>
      <button className={'btn'} onClick={handleDislike}>
        <DislikeIcon type={isDisliked ? 'dislike' : 'neutral'} />
      </button>
    </div>
  )
}
