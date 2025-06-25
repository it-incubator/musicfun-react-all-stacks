import { ReactionIcon } from "@/common/icons"

import s from "./Reactions.module.css"
import { useDislikeMutation, useLikeMutation, useRemoveReactionMutation } from "@/features/tracks/api/tracksApi.ts"
import { CurrentUserReaction } from "@/features/tracks/lib/enums/enums.ts"

type Props = {
  currentUserReaction: CurrentUserReaction
  likesCount: number
  dislikesCount: number
  trackId: string
}

export const Reactions = ({ currentUserReaction, likesCount, dislikesCount, trackId }: Props) => {
  const [setDislike] = useDislikeMutation()
  const [setLike] = useLikeMutation()
  const [setRemoveReaction] = useRemoveReactionMutation()

  const mutate = (reaction: "like" | "dislike") =>
    reaction === "like" ? setLike({ trackId }) : setDislike({ trackId })

  const setReaction = (reaction: "like" | "dislike") => {
    if ((reaction === "like" && isLiked) || (reaction === "dislike" && isDisliked)) {
      setRemoveReaction({ trackId })
    } else mutate(reaction)
  }

  const isLiked = currentUserReaction === CurrentUserReaction.Like
  const isDisliked = currentUserReaction === CurrentUserReaction.Dislike

  return (
    <div className={s.container}>
      <button className={`btn ${isLiked ? s.active : ""}`} onClick={() => setReaction("like")}>
        <ReactionIcon active={isLiked} activeColor={"green"} type={"like"} /> {likesCount}
      </button>
      <button className={`btn ${isDisliked ? s.active : ""}`} onClick={() => setReaction("dislike")}>
        <ReactionIcon active={isDisliked} activeColor={"red"} type={"dislike"} /> {dislikesCount}
      </button>
    </div>
  )
}
