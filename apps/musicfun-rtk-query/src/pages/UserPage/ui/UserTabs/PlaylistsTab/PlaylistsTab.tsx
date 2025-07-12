import { useParams, useSearchParams } from 'react-router'

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
  Pagination,
} from '@/shared/components'
import { MoreIcon } from '@/shared/icons'

import s from './PlaylistsTab.module.css'

export const PlaylistsTab = () => {
  const { userId } = useParams()

  const { handleOpenCreatePlaylistModal } = useCreatePlaylistModal()
  const { handleOpenEditPlaylistModal } = useEditPlaylistModal()
  const [removePlaylist] = useRemovePlaylistMutation()

  const [searchParams, setSearchParams] = useSearchParams()

  const pageNumber = Number(searchParams.get('page')) || 1
  const { data: playlists } = useFetchPlaylistsQuery({ pageNumber, userId: userId! })
  const pagesCount = playlists?.meta.pagesCount || 1

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      if (page === 1) {
        prev.delete('page')
      } else {
        prev.set('page', page.toString())
      }
      return prev
    })
  }

  return (
    <>
      <Button className={s.createPlaylistButton} onClick={handleOpenCreatePlaylistModal}>
        Create Playlist
      </Button>

      {playlists?.data && (
        <ContentList
          data={playlists?.data}
          renderItem={(playlist) => {
            const image = playlist.attributes.images.main[0]
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
      <Pagination page={pageNumber} pagesCount={pagesCount} onPageChange={handlePageChange} />
    </>
  )
}
