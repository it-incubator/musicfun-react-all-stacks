import {
  useDislikePlaylistMutation,
  useLikePlaylistMutation,
  useUnReactionPlaylistMutation,
} from '@/features/playlists'
import {
  CurrentUserReaction,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  ReactionButtons,
} from '@/shared/components'
import { EditIcon, MoreIcon, PlayIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'

export const ControlPanel = ({
  playlistId,
  isOwnPlaylist,
  reaction,
}: {
  playlistId: string
  isOwnPlaylist: boolean
  reaction: CurrentUserReaction
}) => {
  const [like] = useLikePlaylistMutation()
  const [dislike] = useDislikePlaylistMutation()
  const [unReaction] = useUnReactionPlaylistMutation()

  return (
    <div className={s.box}>
      <IconButton className={s.playButton}>
        <PlayIcon />
      </IconButton>

      <ReactionButtons
        reaction={reaction}
        onLike={() => like({ id: playlistId })}
        onDislike={() => dislike({ id: playlistId })}
        onUnReaction={() => unReaction({ id: playlistId })}
        size="large"
      />

      {isOwnPlaylist && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => {}}>
              <EditIcon />
              <span>Edit</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
