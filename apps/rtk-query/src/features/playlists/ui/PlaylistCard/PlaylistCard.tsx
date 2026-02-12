import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import {
  useDislikePlaylistMutation,
  useLikePlaylistMutation,
  useUnReactionPlaylistMutation,
} from '@/features/playlists'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Card, CurrentUserReaction, ReactionButtons, Typography } from '@/shared/components'
import { Paths } from '@/shared/configs'
import { formatCreatedDate } from '@/shared/utils/format-created-date.ts'

import s from './PlaylistCard.module.css'

type PlaylistCardPropsBase = {
  id: string
  title: string
  imageSrc?: string
  actions?: React.ReactNode
  userName?: string
  userId?: string
  addedAt?: string
  tracksCount?: number
  shouldShowOwnerName?: boolean
  shouldShowCreatedDate?: boolean
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
  tracksCount,
  shouldShowOwnerName = false,
  shouldShowCreatedDate = false,
  ...props
}: PlaylistCardProps) => {
  const [like] = useLikePlaylistMutation()
  const [dislike] = useDislikePlaylistMutation()
  const [unReaction] = useUnReactionPlaylistMutation()
  const { t } = useTranslation()

  const handleUserNameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card className={clsx(s.card, isShowReactionButtons && s.withReactionButtons)}>
      <Link
        to={`${Paths.Playlists}/${id}`}
        className={s.imageLink}
        aria-label={t('playlists.aria_labels.open_playlist', { title })}>
        <div className={s.image}>
          <img src={imageSrc} alt={title} />
        </div>
      </Link>
      <div className={s.header}>
        <Typography variant="h3" className={s.title}>
          {title}
        </Typography>
        {actions}
      </div>

      <div className={s.details}>
        {shouldShowOwnerName && (
          <div className={s.madeFor}>
            <Typography variant="body2" as="span" className={s.madeForText}>
              {t('playlist.made_for')}{' '}
            </Typography>
            <Link
              to={`${Paths.Profile}/${userId}`}
              className={s.userLink}
              onClick={handleUserNameClick}>
              {userName}
            </Link>
          </div>
        )}

        <div className={s.detailsRow}>
          {tracksCount != null && (
            <Typography variant="body2" className={s.tracks}>
              {t('playlist.tracks_count', { count: tracksCount })}
            </Typography>
          )}
          {shouldShowCreatedDate && (
            <>
              <span className={s.dot} aria-hidden="true" />
              <Typography variant="body2" className={s.created}>
                {formatCreatedDate(addedAt)}
              </Typography>
            </>
          )}
        </div>
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
