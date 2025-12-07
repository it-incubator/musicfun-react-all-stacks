import clsx from 'clsx'
import {Link, useNavigate} from 'react-router'

import {
  useDislikePlaylistMutation,
  useLikePlaylistMutation,
  useUnReactionPlaylistMutation,
} from '@/features/playlists'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Card, CurrentUserReaction, ReactionButtons, Typography } from '@/shared/components'
import type {MouseEvent} from "react";
import s from './PlaylistCard.module.css'
import {Paths} from "@/shared/configs";
import {formatCreatedDate} from "@/shared/utils/formatCreatedDate.ts";
import type {PlaylistCardProps} from "@/shared/types";



export const PlaylistCard = ({
  title,
  imageSrc = noCoverPlaceholder,
  id,
  isShowReactionButtons,
  actions,
    userName,
    userId,
    addedAt,
  ...props
}: PlaylistCardProps) => {
  const [like] = useLikePlaylistMutation()
  const [dislike] = useDislikePlaylistMutation()
  const [unReaction] = useUnReactionPlaylistMutation()
  const navigate = useNavigate()

  const handleUserNameClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    navigate(`${Paths.Profile}/${userId}`)
    debugger
  }

  return (
    <Card
      as={Link}
      to={`/playlists/${id}`}
      className={clsx(s.card, isShowReactionButtons && s.withReactionButtons)}>
      <div className={s.image}>
        <img src={imageSrc} alt="" aria-hidden />
      </div>
      <div className={s.header}>
        <Typography variant="h3" className={s.title}>
          {title}
        </Typography>
        {actions}
      </div>

      <div className={s.details}>
        <Typography variant="body2" >
          Made for{' '}
          <button
              type="button"
              className={s.userButton}
              onClick={handleUserNameClick}
          >
            {userName}
          </button>

        <div className={s.detailsRow}>
          <span className={s.tracks}>0 tracks</span>
          <span className={s.dot} aria-hidden="true" />
          <span className={s.created}>Created {formatCreatedDate(addedAt)}</span>
        </div>
        </Typography>
      </div>
      {/*  'reaction' in props — Type guard for correct type checking */}
      {isShowReactionButtons && 'reaction' in props && (
        <ReactionButtons
          className={s.reactionButtons}
          reaction={props.reaction}
          onLike={() => like({ id })}
          onDislike={() => dislike({ id })}
          likesCount={props.likesCount}
          onUnReaction={() => unReaction({ id })}
        />
      )}
    </Card>
  )
}
