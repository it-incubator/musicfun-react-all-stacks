import { useState } from 'react'

import { PlaylistCard } from '@/entities/playlist'
import { CreatePlaylistModal, MOCK_PLAYLISTS } from '@/features/playlists'
import { ContentList } from '@/pages/common'
import { Button, Pagination } from '@/shared/components'

import s from './PlaylistsTab.module.css'

export const PlaylistsTab = () => {
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false) // STATE FOR TESTING

  const openCreatePlaylistModal = () => {
    setIsCreatePlaylistModalOpen(true)
  }

  // todo:task load user playlists

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
            images={playlist.data.attributes.images || []}
            description={playlist.data.attributes.description}
          />
        )}
      />
      <Pagination page={1} pagesCount={2} onPageChange={() => {}} />
    </>
  )
}
