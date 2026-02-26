import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import {
  Card,
  CoverImage,
  IconButton,
  ReactionButtons,
  type ReactionButtonsProps,
  Typography,
} from '@/shared/components'
import { PauseIcon, PlayIcon } from '@/shared/icons'

import s from './TrackCard.module.css'

type Props = {
  id: string
  image: string
  title: string
  artists: string
  onPlaybackClick: () => void
  isPlaying: boolean
} & Omit<ReactionButtonsProps, 'className' | 'entityId'>

export const TrackCard = ({
  id,
  image,
  title,
  artists,
  onPlaybackClick,
  isPlaying,
  currentReaction,
  onRemoveReaction,
  onLike,
  onDislike,
  likesCount,
}: Props) => {
  const { t } = useTranslation()

  return (
    <Card className={s.card}>
      <div className={s.image}>
        <CoverImage imageSrc={image} imageDescription={title} />
        <IconButton className={s.playback} onClick={onPlaybackClick}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
      </div>

      <Typography variant="h3" className={s.title} as={Link} to={`/tracks/${id}`}>
        {title}
      </Typography>

      <Typography variant="body3" className={s.artists}>
        {artists || t('player.unknown_artist')}
      </Typography>
      <ReactionButtons
        currentReaction={currentReaction}
        entityId={id}
        likesCount={likesCount}
        onDislike={onDislike}
        onLike={onLike}
        onRemoveReaction={onRemoveReaction}
      />
    </Card>
  )
}
