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

import s from './ControlPanel.module.css'

export const ControlPanel = ({ playlistId }: { playlistId: string }) => {
  const handleDeletePlaylist = useDeletePlaylistAction(playlistId)

  return (
    <div className={s.box}>
      <IconButton className={s.playButton}>
        <PlayIcon />
      </IconButton>

      <ReactionButtons reaction={0} onLike={() => {}} onDislike={() => {}} size="large" />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => {}}>
            <EditIcon className={s.menuIcon} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeletePlaylist} className={s.deleteItem}>
            <DeleteIcon className={s.menuIcon} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}