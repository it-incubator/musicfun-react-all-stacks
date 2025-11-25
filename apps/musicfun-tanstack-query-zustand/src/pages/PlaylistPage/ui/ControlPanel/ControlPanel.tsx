import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  ReactionButtons,
} from '@/shared/components'
import { DeleteIcon, EditIcon, MoreIcon, PlayIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'
import shared from '@/shared/styles/shared.module.css'

import { useDeletePlaylistAction } from '@/shared/hooks/useDeletePlaylistAction'

export const ControlPanel = ({ playlistId }: { playlistId: string }) => {
  const handleDeletePlaylist = useDeletePlaylistAction(playlistId)

  return (
    <div className={s.box}>
      <IconButton className={s.playButton}>
        <PlayIcon />
      </IconButton>

      <ReactionButtons
        onRemoveReaction={() => {}}
        currentReaction={0}
        onLike={() => {}}
        onDislike={() => {}}
        size="large"
        entityId={''}
      />
      {/* todo:task add delete button for playlist owner and implement logic */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => {}}>
            <EditIcon className={shared.menuIcon} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeletePlaylist} className={shared.deleteItem}>
            <DeleteIcon className={shared.menuIcon} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
