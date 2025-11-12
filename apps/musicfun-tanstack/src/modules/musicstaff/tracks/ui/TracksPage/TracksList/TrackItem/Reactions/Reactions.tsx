import { tracksKey } from '@/common/apiEntities'
import { ReactionIcon } from '@/common/icons'
import { showErrorToast } from '@/common/utils'
import { tracksApi } from '../../../../../api/tracksApi.ts'
import { CurrentUserReaction } from '@/common/enums/enums.ts'
import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'
import s from './Reactions.module.css'

type Props = {
  currentUserReaction: CurrentUserReaction
  likesCount: number
  dislikesCount: number
  trackId: string
}

export const Reactions = ({ currentUserReaction, likesCount, dislikesCount, trackId }: Props) => {
  const { mutate } = useMutation({
    mutationFn: (reaction: 'like' | 'dislike') =>
      reaction === 'like' ? tracksApi.like(trackId) : tracksApi.dislike(trackId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [tracksKey, trackId] }),
    onError: (err: unknown) => showErrorToast('Ошибка', err),
  })

  const isLiked = currentUserReaction === CurrentUserReaction.Like
  const isDisliked = currentUserReaction === CurrentUserReaction.Dislike

  return (
    <div className={s.container}>
      <button className={`btn ${isLiked ? s.active : ''}`} onClick={() => mutate('like')}>
        <ReactionIcon active={isLiked} activeColor={'green'} type={'like'} /> {likesCount}
      </button>
      <button className={`btn ${isDisliked ? s.active : ''}`} onClick={() => mutate('dislike')}>
        <ReactionIcon active={isDisliked} activeColor={'red'} type={'dislike'} /> {dislikesCount}
      </button>
    </div>
  )
}
