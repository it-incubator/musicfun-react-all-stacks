import { useState } from 'react'
import { Modal } from '@/common/components'
import { SelectPlaylists } from '../../../../playlists/lib/components/SelectPlaylists/SelectPlaylists.tsx'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (playlistId: string) => void
}

export const AddTrackToPlaylistModal = ({ open, onClose, onSave }: Props) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')

  const handleSubmit = () => {
    if (selectedPlaylistId) {
      onSave(selectedPlaylistId)
    }
  }

  return (
    <Modal modalTitle="Добавить трек в плейлист" open={open} onClose={onClose}>
      <SelectPlaylists value={selectedPlaylistId} onChange={setSelectedPlaylistId} />
      <div>
        <button onClick={handleSubmit}>Сохранить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </Modal>
  )
}
