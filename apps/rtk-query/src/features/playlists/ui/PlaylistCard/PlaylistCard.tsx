import clsx from 'clsx'
import {Link, useNavigate} from 'react-router'

import {
    useDislikePlaylistMutation,
    useLikePlaylistMutation,
    useUnReactionPlaylistMutation,
} from '@/features/playlists'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import {Card, CurrentUserReaction, ReactionButtons, Typography} from '@/shared/components'
import type {MouseEvent} from "react";
import s from './PlaylistCard.module.css'
import {Paths} from "@/shared/configs";
import {formatCreatedDate} from "@/shared/utils/formatCreatedDate.ts";

type PlaylistCardPropsBase = {
    id: string
    title: string
    imageSrc?: string
    actions?: React.ReactNode
    userName?: string
    userId?: string
    addedAt?: string
    isShowCurrentUser?: boolean
    isShowCreatedDate?: boolean
}

type PlaylistCardPropsWithReactions = PlaylistCardPropsBase & {
    isShowReactionButtons: true
    reaction: CurrentUserReaction
    likesCount: number
}

type PlaylistCardPropsWithoutReactions = PlaylistCardPropsBase & {
    isShowReactionButtons?: false
}

type PlaylistCardProps = PlaylistCardPropsWithReactions | PlaylistCardPropsWithoutReactions

export const PlaylistCard = ({
                                 title,
                                 imageSrc = noCoverPlaceholder,
                                 id,
                                 isShowReactionButtons,
                                 actions,
                                 userName,
                                 userId,
                                 addedAt,
                                 isShowCurrentUser = true,
                                 isShowCreatedDate = true,
                                 ...props
                             }: PlaylistCardProps) => {
    const [like] = useLikePlaylistMutation()
    const [dislike] = useDislikePlaylistMutation()
    const [unReaction] = useUnReactionPlaylistMutation()
    const navigate = useNavigate()

    const handleUserNameClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(`${Paths.Profile}/${userId}`)
    }

    return (
        <Card
            className={clsx(s.card, isShowReactionButtons && s.withReactionButtons)}>
            <Link
                to={`/playlists/${id}`}
                className={s.imageLink}
                aria-label={`Open playlist ${title}`}
            >
                <div className={s.image}>
                    <img src={imageSrc} alt={title}/>
                </div>
            </Link>
            <div className={s.header}>
                <Typography variant="h3" className={s.title}>
                    {title}
                </Typography>
                {actions}
            </div>

            <div className={s.details}>
                {isShowCurrentUser &&
                    <div className={s.madeFor}>
                        <Typography variant="body2" as="span">Made for </Typography>
                        <Link
                            to={`/users/${userId}`}
                            className={s.userLink}
                            onClick={handleUserNameClick}
                        >
                            {userName}
                        </Link>
                    </div>
                }

                <div className={s.detailsRow}>
                    <Typography variant="body2" className={s.tracks}>
                        0 tracks
                    </Typography>
                    {isShowCreatedDate && (
                        <>
                        <span className={s.dot} aria-hidden="true"/>
                        <Typography variant="body2" className={s.created}>
                      {formatCreatedDate(addedAt)}
                </Typography>
                        </>
                )}
            </div>
        </div>
{/*  'reaction' in props — Type guard for correct type checking */
}
{
    isShowReactionButtons && 'reaction' in props && (
        <ReactionButtons
            className={s.reactionButtons}
            reaction={props.reaction}
            onLike={() => like({id})}
            onDislike={() => dislike({id})}
            likesCount={props.likesCount}
            onUnReaction={() => unReaction({id})}
        />
    )
}
</Card>
)
}
