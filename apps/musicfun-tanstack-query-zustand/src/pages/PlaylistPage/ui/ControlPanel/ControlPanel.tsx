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

export const ControlPanel = () => {
  /*const handleDeletePlaylist = useDeletePlaylistAction()*/

  return (
    <div className={s.box}>
      <IconButton className={s.playButton}>
        <PlayIcon />
      </IconButton>

      <ReactionButtons reaction={0} onLike={() => {}} onDislike={() => {}} size="large" />
      {/* todo:task add delete button for playlist owner and implement logic */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => {}}>
            <EditIcon className={s.menuIcon} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className={s.deleteItem}>
            <DeleteIcon className={s.menuIcon} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}