import { useParams } from 'react-router'

export const PlaylistTracks = () => {
  const { playlistId } = useParams<{ playlistId?: string }>()

  return (
    <div>
      <h2>Треки плейлиста</h2>
      <p>Здесь будет список треков плейлиста с ID: {playlistId}</p>
      {/* Здесь будет реализация треков плейлиста */}
    </div>
  )
}
