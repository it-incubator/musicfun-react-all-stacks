import { useState } from 'react'

import { CreatePlaylistModal, MOCK_PLAYLISTS, PlaylistCard } from '@/features/playlists'
import { ContentList } from '@/pages/common'
import { Button, Pagination, Typography } from '@/shared/components'

import s from './PlaylistsTab.module.css'

export const PlaylistsTab = () => {
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false) // STATE FOR TESTING

  const openCreatePlaylistModal = () => {
    setIsCreatePlaylistModalOpen(true)
  }

  return (
    <>
      <Button className={s.createPlaylistButton} onClick={openCreatePlaylistModal}>
        Create Playlist
      </Button>

      {isCreatePlaylistModalOpen && (
        <CreatePlaylistModal onClose={() => setIsCreatePlaylistModalOpen(false)} />
      )}
      <ContentList
        data={[...MOCK_PLAYLISTS]}
        renderItem={(playlist) => (
          <PlaylistCard
            id={playlist.data.id}
            title={playlist.data.attributes.title}
            image={playlist.data.attributes.images.main[0].url}
            description={playlist.data.attributes.description.text}
          />
        )}
      />
      <Pagination page={1} pagesCount={2} onPageChange={() => {}} />
    </>
  )
}
