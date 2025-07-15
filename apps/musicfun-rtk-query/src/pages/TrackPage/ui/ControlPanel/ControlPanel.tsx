import { useDislikeTrackMutation, useLikeTrackMutation } from '@/features/tracks'
import { useUnReactionTrackMutation } from '@/features/tracks'
import {
  CurrentUserReaction,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  ReactionButtons,
} from '@/shared/components'
import { AddToPlaylistIcon, EditIcon, MoreIcon, PlayIcon, TextIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'

export const ControlPanel = ({
  trackId,
  isOwnTrack,
  reaction,
  likesCount,
}: {
  trackId: string
  isOwnTrack: boolean
  reaction: CurrentUserReaction
  likesCount: number
}) => {
  const [like] = useLikeTrackMutation()
  const [dislike] = useDislikeTrackMutation()
  const [unReaction] = useUnReactionTrackMutation()

  return (
    <div className={s.box}>
      <IconButton className={s.playButton}>
        <PlayIcon />
      </IconButton>

      <ReactionButtons
        reaction={reaction}
        onLike={() => like({ trackId })}
        onDislike={() => dislike({ trackId })}
        onUnReaction={() => unReaction({ trackId })}
        size="large"
        likesCount={likesCount}
      />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => {}}>
            <EditIcon />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {}}>
            <AddToPlaylistIcon />
            <span>Add to playlist</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {}}>
            <TextIcon />
            <span>Show lyrics</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
