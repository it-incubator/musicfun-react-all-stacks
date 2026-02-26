import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import {
  useDislikePlaylistMutation,
  useEditPlaylistModal,
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

type ControlPanelProps = {
  playlistId: string
  isOwnPlaylist: boolean
  reaction: CurrentUserReaction
  likesCount: number
  className?: string
  onPlayAll?: () => void
}

export const ControlPanel = ({
  playlistId,
  isOwnPlaylist,
  reaction,
  likesCount,
  className,
  onPlayAll,
}: ControlPanelProps) => {
  const { t } = useTranslation()

  const [like] = useLikePlaylistMutation()
  const [dislike] = useDislikePlaylistMutation()
  const [unReaction] = useUnReactionPlaylistMutation()

  const { handleOpenEditPlaylistModal } = useEditPlaylistModal()

  return (
    <div className={clsx(s.box, className)}>
      <IconButton className={s.playButton} onClick={onPlayAll}>
        <PlayIcon />
      </IconButton>

      <ReactionButtons
        reaction={reaction}
        onLike={() => like({ id: playlistId })}
        onDislike={() => dislike({ id: playlistId })}
        onUnReaction={() => unReaction({ id: playlistId })}
        likesCount={likesCount}
        size="large"
      />

      {isOwnPlaylist && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => {
                handleOpenEditPlaylistModal(playlistId)
              }}>
              <EditIcon />
              <span>{t('button.edit')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
