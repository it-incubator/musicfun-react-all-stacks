import { useTranslation } from 'react-i18next'

import { useRemovePlaylistMutation } from '@/features/playlists/api'
import { useEditPlaylistModal } from '@/features/playlists/model'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { DeleteIcon, EditIcon, MoreIcon } from '@/shared/icons'

type PlaylistActionsProps = {
  playlistId: string
}

export const PlaylistActions = ({ playlistId }: PlaylistActionsProps) => {
  const { t } = useTranslation()
  const { handleOpenEditPlaylistModal } = useEditPlaylistModal()
  const [removePlaylist] = useRemovePlaylistMutation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            handleOpenEditPlaylistModal(playlistId)
          }}>
          <EditIcon />
          {t('button.edit')}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            removePlaylist(playlistId)
          }}>
          <DeleteIcon width={24} height={24} />
          {t('button.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
