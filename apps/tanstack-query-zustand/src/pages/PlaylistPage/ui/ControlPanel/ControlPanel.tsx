import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  ReactionButtons,
} from '@/shared/components'
import { useDeletePlaylistAction } from '@/shared/hooks/useDeletePlaylistAction'
import { DeleteIcon, EditIcon, MoreIcon, PlayIcon } from '@/shared/icons'
import { useUIStore } from '@/shared/model/ui-store'
import { useTranslation } from 'react-i18next'

import s from './ControlPanel.module.scss'

type ControlPanelProps = {
  playlistId: string
  isOwnPlaylist?: boolean
  currentReaction?: number
  likesCount?: number
  onLike?: () => void
  onDislike?: () => void
  onRemoveReaction?: () => void
  onPlayAll?: () => void
}

export const ControlPanel = ({
  playlistId,
  isOwnPlaylist,
  currentReaction = 0,
  likesCount = 0,
  onLike,
  onDislike,
  onRemoveReaction,
  onPlayAll,
}: ControlPanelProps) => {
  const { t } = useTranslation()

  const handleDeletePlaylist = useDeletePlaylistAction(playlistId)
  const { openCreatePlaylistModal } = useUIStore()

  return (
    <div className={s.box}>
      <IconButton className={s.playButton} onClick={onPlayAll}>
        <PlayIcon />
      </IconButton>

      <ReactionButtons
        onRemoveReaction={onRemoveReaction || (() => {})}
        currentReaction={currentReaction}
        onLike={onLike || (() => {})}
        onDislike={onDislike || (() => {})}
        size="large"
        entityId={playlistId}
        likesCount={likesCount}
      />
      {isOwnPlaylist && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => openCreatePlaylistModal(playlistId)}>
              <EditIcon className={s.menuIcon} />
              <span>{t('button.edit')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeletePlaylist} className={s.deleteItem}>
              <DeleteIcon className={s.menuIcon} />
              <span>{t('button.delete')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
