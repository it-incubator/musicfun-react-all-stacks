import { useLikePlaylistMutation, useDislikePlaylistMutation } from "@/features/playlists/api/playlistsApi"
import { CurrentUserReaction } from "@/common/enums"
import { showErrorToast } from "@/common/utils"
import { LikeIcon } from "@/common/icons/LikeIcon/LikeIcon.tsx"

type Props = {
  id: string
  currentUserReaction: CurrentUserReaction
}

export const PlaylistReactions = ({ id, currentUserReaction }: Props) => {
  const [likePlaylist, { isLoading: isLiking }] = useLikePlaylistMutation()
  const [dislikePlaylist, { isLoading: isDisliking }] = useDislikePlaylistMutation()

  const isLiked = currentUserReaction === CurrentUserReaction.Like

  const handleClick = async () => {
    try {
      if (isLiked) {
        await dislikePlaylist({ id }).unwrap()
      } else {
        await likePlaylist({ id }).unwrap()
      }
    } catch (err) {
      showErrorToast("Ошибка", err)
    }
  }

  return (
    <button className={"btn"} onClick={handleClick} disabled={isLiking || isDisliking}>
      <LikeIcon type={isLiked ? "like" : "dislike"} />
    </button>
  )
}
