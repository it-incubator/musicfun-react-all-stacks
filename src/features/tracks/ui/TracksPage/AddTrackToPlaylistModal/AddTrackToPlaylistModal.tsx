import { type ChangeEvent, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Modal } from "@/common/components/Modal/Modal"
import { PlaylistQueryKey, playlistsApi } from "@/features/playlists/api/playlistsApi"

type Props = {
  open: boolean
  onClose: () => void
  onSave: (playlistId: string) => void
}

export const AddTrackToPlaylistModal = ({ open, onClose, onSave }: Props) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("")

  const { data } = useQuery({ queryKey: [PlaylistQueryKey, "my"], queryFn: playlistsApi.fetchMyPlaylists })

  const selectPlaylistIdHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaylistId(e.currentTarget.value)
  }

  const handleSubmit = () => {
    if (selectedPlaylistId) {
      onSave(selectedPlaylistId)
    }
  }

  return (
    <Modal modalTitle="Добавить трек в плейлист" open={open} onClose={onClose}>
      <select onChange={selectPlaylistIdHandler} value={selectedPlaylistId}>
        <option value="" disabled>
          -- Выберите плейлист --
        </option>
        {data?.data.data.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.attributes.title}
          </option>
        ))}
      </select>
      <div>
        <button onClick={handleSubmit}>Сохранить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </Modal>
  )
}

//
// <Modal modalTitle={"Добавить трек в плейлист"} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
// 	<label>
// 		Выберите плейлист:
// 		<select onChange={(e) => setPlaylistId(e.target.value)} value={playlistId ?? ""}>
// 			<option value="" disabled>
// 				-- Выберите плейлист --
// 			</option>
// 			{data?.data.data.map((playlist) => (
// 				<option key={playlist.id} value={playlist.id}>
// 					{playlist.attributes.title}
// 				</option>
// 			))}
// 		</select>
// 	</label>
// 	<button onClick={handleSavePlaylist}>Сохранить</button>
// 	<button onClick={() => setIsModalOpen(false)}>Отмена</button>
// </Modal>
