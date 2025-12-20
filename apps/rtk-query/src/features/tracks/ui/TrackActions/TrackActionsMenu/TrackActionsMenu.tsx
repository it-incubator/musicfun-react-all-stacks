import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { Paths } from '@/shared/configs'
import { useCurrentPage } from '@/shared/hooks'
import { AddToPlaylistIcon, DeleteIcon, EditIcon, MoreIcon, TextIcon } from '@/shared/icons'

type TrackActionsMenuProps = {
  trackId: string
  isOwner: boolean
  onEdit: () => void
  onDelete: () => void
  onAddToPlaylist: () => void
}

export const TrackActionsMenu = ({
  trackId,
  isOwner,
  onEdit,
  onDelete,
  onAddToPlaylist,
}: TrackActionsMenuProps) => {
  const { t } = useTranslation()
  const { isTrackPage, isPlaylistPage } = useCurrentPage()
  const navigate = useNavigate()

  const showDelete = !isTrackPage
  const showLyrics = isTrackPage

  const deleteLabel = isPlaylistPage ? 'tracks.button.delete_from_playlist' : 'tracks.button.delete'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isOwner && (
          <>
            <DropdownMenuItem onClick={onEdit}>
              <EditIcon />
              {t('tracks.button.edit')}
            </DropdownMenuItem>
            {showDelete && (
              <DropdownMenuItem onClick={onDelete}>
                <DeleteIcon width={24} height={24} />
                {t(deleteLabel)}
              </DropdownMenuItem>
            )}
          </>
        )}
        <DropdownMenuItem onClick={onAddToPlaylist}>
          <AddToPlaylistIcon />
          {t('tracks.button.add_to_playlist')}
        </DropdownMenuItem>
        {showLyrics && (
          <DropdownMenuItem onClick={() => navigate(`${Paths.TracksLyrics}/${trackId}`)}>
            <TextIcon />
            {t('tracks.button.show_text_song')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
