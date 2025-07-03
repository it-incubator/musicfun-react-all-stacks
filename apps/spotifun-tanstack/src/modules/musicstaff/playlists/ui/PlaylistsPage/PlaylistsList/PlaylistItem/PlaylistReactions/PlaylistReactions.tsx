import { playlistsKey } from "@/common/apiEntities"
import { CurrentUserReaction } from "@/common/enums"
import { LikeIcon } from "@/common/icons"
import { showErrorToast } from "@/common/utils"
import { playlistsApi } from "@/modules/musicstaff/playlists/api/playlistsApi.ts"

import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"

type Props = {
  id: string
  currentUserReaction: CurrentUserReaction
}

export const PlaylistReactions = ({ id, currentUserReaction }: Props) => {
  const { mutate } = useMutation({
    mutationFn: (reaction: "like" | "dislike") =>
      reaction === "like" ? playlistsApi.like(id) : playlistsApi.dislike(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [playlistsKey] }),
    onError: (err: unknown) => showErrorToast("Ошибка", err),
  })

  const isLiked = currentUserReaction === CurrentUserReaction.Like

  return (
    <button className={"btn"} onClick={() => mutate(isLiked ? "dislike" : "like")}>
      <LikeIcon type={isLiked ? "like" : "dislike"} />
    </button>
  )
}
