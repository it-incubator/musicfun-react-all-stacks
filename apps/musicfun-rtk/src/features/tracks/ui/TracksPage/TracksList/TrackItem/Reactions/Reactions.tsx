import { ReactionIcon } from '@/common/icons'

import s from './Reactions.module.css'
import { useDislikeMutation, useLikeMutation, useRemoveReactionMutation } from '@/features/tracks/api/tracksApi.ts'
import { CurrentUserReaction } from '@/features/tracks/lib/enums/enums.ts'

type Props = {
  currentUserReaction: CurrentUserReaction
  likesCount: number
  dislikesCount: number
  trackId: string
}

export const Reactions = ({ currentUserReaction, likesCount, dislikesCount, trackId }: Props) => {
  const [setDislike, { isLoading: isDislikeLoading }] = useDislikeMutation()
  const [setLike, { isLoading: isLikeLoading }] = useLikeMutation()
  const [setRemoveReaction, { isLoading: isRemoveLoading }] = useRemoveReactionMutation()

  const isLiked = currentUserReaction === CurrentUserReaction.Like
  const isDisliked = currentUserReaction === CurrentUserReaction.Dislike

  const isMutating = isLikeLoading || isDislikeLoading || isRemoveLoading

  const mutate = (reaction: 'like' | 'dislike') =>
    reaction === 'like' ? setLike({ trackId }) : setDislike({ trackId })

  const setReaction = (reaction: 'like' | 'dislike') => {
    if ((reaction === 'like' && isLiked) || (reaction === 'dislike' && isDisliked)) {
      setRemoveReaction({ trackId })
    } else mutate(reaction)
  }

  return (
    <div className={s.container}>
      <button className={`btn ${isLiked ? s.active : ''}`} onClick={() => setReaction('like')} disabled={isMutating}>
        <ReactionIcon active={isLiked} activeColor={'green'} type={'like'} /> {likesCount}
      </button>
      <button
        className={`btn ${isDisliked ? s.active : ''}`}
        onClick={() => setReaction('dislike')}
        disabled={isMutating}
      >
        <ReactionIcon active={isDisliked} activeColor={'red'} type={'dislike'} /> {dislikesCount}
      </button>
    </div>
  )
}
