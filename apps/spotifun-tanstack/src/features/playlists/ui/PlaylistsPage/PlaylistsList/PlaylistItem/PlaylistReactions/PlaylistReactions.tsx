import { playlistsKey } from "@/common/apiEntities"
import { CurrentUserReaction } from "@/common/enums"
import { DislikeIcon, LikeIcon } from "@/common/icons"
import { showErrorToast } from "@/common/utils"
import { playlistsApi } from "@/features/playlists/api/playlistsApi.ts"

import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"

type Props = {
  id: string
  currentUserReaction: CurrentUserReaction
}

export const PlaylistReactions = ({ id, currentUserReaction }: Props) => {
  const { mutate } = useMutation({
    mutationFn: (reaction: "like" | "dislike" | "remove") => {
      switch (reaction) {
        case "like":
          return playlistsApi.like(id);
        case "dislike":
          return playlistsApi.dislike(id);
        case "remove":
          return playlistsApi.removeReaction(id);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [playlistsKey] }),
    onError: (err: unknown) => showErrorToast("Ошибка", err),
  })

  const isLiked = currentUserReaction === CurrentUserReaction.Like
  const isDisliked = currentUserReaction === CurrentUserReaction.Dislike

  const onHandleLike = () => {
    if (isLiked) {
      mutate("remove");
    } else {
      mutate("like");
    }
  };

  const onHandleDislike = () => {
    if (isDisliked) {
      mutate("remove");
    } else {
      mutate("dislike");
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <button className={"btn"} onClick={onHandleLike}>
        <LikeIcon type={isLiked ? "filled" : "outline"} />
      </button>
      <button className={"btn"} onClick={onHandleDislike}>
        <DislikeIcon type={isDisliked ? "filled" : "outline"} />
      </button>
    </div>
  )
}
