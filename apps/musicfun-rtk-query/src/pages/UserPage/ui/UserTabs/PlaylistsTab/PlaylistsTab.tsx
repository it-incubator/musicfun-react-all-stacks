import { useParams, useSearchParams } from 'react-router'

import { PlaylistCard, useCreatePlaylistModal, useFetchPlaylistsQuery } from '@/features/playlists'
import { ContentList } from '@/pages/common'
import { Button, Pagination } from '@/shared/components'

import s from './PlaylistsTab.module.css'

export const PlaylistsTab = () => {
  const { userId } = useParams()
  const { handleOpenCreatePlaylistModal } = useCreatePlaylistModal()

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
              />
            )
          }}
        />
      )}
      <Pagination page={pageNumber} pagesCount={pagesCount} onPageChange={handlePageChange} />
    </>
  )
}
