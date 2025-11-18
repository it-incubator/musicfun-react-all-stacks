import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  ReactionButtons,
} from '@/shared/components'
import { EditIcon, MoreIcon, PlayIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'

export const ControlPanel = () => {
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
            <EditIcon />
            <span>Edit</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
