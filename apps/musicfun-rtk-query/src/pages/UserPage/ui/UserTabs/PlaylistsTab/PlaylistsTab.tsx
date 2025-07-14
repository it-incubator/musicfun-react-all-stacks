import { useParams } from 'react-router'

import {
  PlaylistCard,
  useCreatePlaylistModal,
  useEditPlaylistModal,
  useFetchPlaylistsQuery,
  useRemovePlaylistMutation,
} from '@/features/playlists'
import { ContentList } from '@/pages/common'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { MoreIcon } from '@/shared/icons'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import s from './PlaylistsTab.module.css'

export const PlaylistsTab = () => {
  const { userId } = useParams()

  const { handleOpenCreatePlaylistModal } = useCreatePlaylistModal()
  const { handleOpenEditPlaylistModal } = useEditPlaylistModal()
  const [removePlaylist] = useRemovePlaylistMutation()

  const { data: playlists } = useFetchPlaylistsQuery({ userId: userId! })

  return (
    <>
      <Button className={s.createPlaylistButton} onClick={handleOpenCreatePlaylistModal}>
        Create Playlist
      </Button>

      {playlists?.data && (
        <ContentList
          data={playlists?.data}
          renderItem={(playlist) => {
            const image = getImageByType(playlist.attributes.images, ImageType.MEDIUM)
            return (
              <PlaylistCard
                id={playlist.id}
                title={playlist.attributes.title}
                imageSrc={image?.url}
                description={playlist.attributes.description}
                actions={
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          handleOpenEditPlaylistModal(playlist.id)
                        }}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          removePlaylist(playlist.id)
                        }}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            )
          }}
        />
      )}
    </>
  )
}
