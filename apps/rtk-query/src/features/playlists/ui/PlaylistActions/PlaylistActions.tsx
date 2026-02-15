import { useTranslation } from 'react-i18next'

import { useRemovePlaylistMutation } from '@/features/playlists/api'
import { useEditPlaylistModal } from '@/features/playlists/model'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { DeleteConfirmationDialog } from '@/shared/components/DeleteConfirmationDialog'
import { DeleteIcon, EditIcon, MoreIcon } from '@/shared/icons'
import { useState } from 'react'

type PlaylistActionsProps = {
  playlistId: string
  playlistTitle: string
}

export const PlaylistActions = ({ playlistId, playlistTitle }: PlaylistActionsProps) => {
  const { t } = useTranslation()
  const { handleOpenEditPlaylistModal } = useEditPlaylistModal()
  const [removePlaylist, { isLoading }] = useRemovePlaylistMutation()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteConfirm = async () => {
    await removePlaylist(playlistId).unwrap()
  }

  return (
    <>
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

          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <DeleteIcon width={24} height={24} />
            {t('button.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        entityType="playlist"
        entityName={playlistTitle}
        isLoading={isLoading}
      />
    </>
  )
}
