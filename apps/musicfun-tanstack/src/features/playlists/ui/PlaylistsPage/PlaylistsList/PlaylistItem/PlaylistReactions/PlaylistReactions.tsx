import { playlistsKey } from '@/common/apiEntities'
import { CurrentUserReaction } from '@/common/enums'
import { DislikeIcon, LikeIcon } from '@/common/icons'
import { showErrorToast } from '@/common/utils'
import { playlistsApi } from '@/features/playlists/api/playlistsApi.ts'

import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'
import styles from './PlaylistReactions.module.scss'

type Props = {
  id: string
  currentUserReaction: CurrentUserReaction
}

export const PlaylistReactions = ({ id, currentUserReaction }: Props) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (reaction: 'like' | 'dislike' | 'remove') => {
      switch (reaction) {
        case 'like':
          return playlistsApi.like(id)
        case 'dislike':
          return playlistsApi.dislike(id)
        case 'remove':
          return playlistsApi.removeReaction(id)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [playlistsKey] }),
    onError: (err: unknown) => showErrorToast('Ошибка', err),
  })

  const isLiked = currentUserReaction === CurrentUserReaction.Like
  const isDisliked = currentUserReaction === CurrentUserReaction.Dislike

  const onHandleLike = () => {
    if (isLiked) {
      mutate('remove')
    } else {
      mutate('like')
    }
  }

  const onHandleDislike = () => {
    if (isDisliked) {
      mutate('remove')
    } else {
      mutate('dislike')
    }
  }

  return (
    <div className={styles.reactions}>
      <button className={`btn ${isPending ? styles.disabled : ''}`} onClick={onHandleLike} disabled={isPending}>
        <LikeIcon type={isLiked ? 'filled' : 'outline'} />
      </button>
      <button className={`btn ${isPending ? styles.disabled : ''}`} onClick={onHandleDislike} disabled={isPending}>
        <DislikeIcon type={isDisliked ? 'filled' : 'outline'} />
      </button>
    </div>
  )
}
