import { useParams } from 'react-router'

export const PlaylistTracks = () => {
  const { playlistId } = useParams<{ playlistId?: string }>()

  return (
    <div>
      <h2>Playlist Tracks</h2>
      <p>Here will be the playlist tracks list with ID: {playlistId}</p>
      {/* Here will be playlist tracks implementation */}
    </div>
  )
}
