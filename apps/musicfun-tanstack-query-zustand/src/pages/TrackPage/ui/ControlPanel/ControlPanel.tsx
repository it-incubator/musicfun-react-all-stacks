import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  ReactionButtons,
} from '@/shared/components'
import { AddToPlaylistIcon, EditIcon, MoreIcon, PlayIcon, TextIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'

export const ControlPanel = () => {
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
