import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useMeQuery } from '@/features/auth'
import { useFetchPlaylistsQuery } from '@/features/playlists'
import { ChoosePlaylistModal } from '@/features/playlists/ui/ChoosePlaylistModal/ChoosePlaylistModal.tsx'
import { Typography } from '@/shared/components'

import s from './ChoosePlaylistButtonAndModal.module.css'

export const ChoosePlaylistButtonAndModal = ({
  playlistIds,
  setPlaylistIds,
}: {
  playlistIds: string[]
  setPlaylistIds: (playlistIds: string[]) => void
}) => {
  const { t } = useTranslation()

  const { data: user } = useMeQuery()

  const [isOpen, setIsOpen] = useState(false)

  const { data: playlists } = useFetchPlaylistsQuery({
    userId: user?.userId,
  })

  const selectedPlaylists = playlists?.data.filter((p) => playlistIds.includes(p.id)) ?? []

  return (
    <>
      <div>
        <Typography variant="label" as="p">
          Choose playlist
        </Typography>
        <button type="button" className={s.chooseButton} onClick={() => setIsOpen(true)}>
          {playlistIds.length > 0 ? (
            <span>{selectedPlaylists.map((p) => p.attributes.title).join(', ')}</span>
          ) : (
            t('playlists.button.choose_playlist')
          )}
        </button>
      </div>
      <ChoosePlaylistModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        playlistIds={playlistIds}
        setPlaylistIds={setPlaylistIds}
      />
    </>
  )
}
