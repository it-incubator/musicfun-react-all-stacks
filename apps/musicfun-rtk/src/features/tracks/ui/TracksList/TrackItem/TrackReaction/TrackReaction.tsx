import { CurrentUserReaction } from '@/common/enums'
import { useOptimisticReactions } from '@/common/hooks'
import { DislikeIcon } from '@/common/icons/DislikeIcon/DislikeIcon.tsx'
import { LikeIcon } from '@/common/icons/LikeIcon/LikeIcon.tsx'
import { useDislikeMutation, useLikeMutation, useRemoveReactionMutation } from '@/features/tracks/api/tracksApi.ts'

type Props = {
  id: string
  currentUserReaction: CurrentUserReaction
}

export const TrackReactions = ({ id, currentUserReaction }: Props) => {
  const [likeTrack] = useLikeMutation()
  const [unReactionTrack] = useRemoveReactionMutation()
  const [dislikeTrack] = useDislikeMutation()

  const { isLiked, isDisliked, handleLike, handleDislike } = useOptimisticReactions({
    currentReaction: currentUserReaction,
    mutations: {
      like: () => likeTrack({ trackId: id }).unwrap(),
      dislike: () => dislikeTrack({ trackId: id }).unwrap(),
      remove: () => unReactionTrack({ trackId: id }).unwrap(),
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
