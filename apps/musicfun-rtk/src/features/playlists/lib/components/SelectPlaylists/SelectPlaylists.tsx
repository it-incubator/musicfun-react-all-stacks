import { useFetchMyPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'

type Props = {
  onChange: (value: string) => void
  value: string
}

export const SelectPlaylists = ({ onChange, value }: Props) => {
  const { data } = useFetchMyPlaylistsQuery()

  return (
    <select onChange={(e) => onChange(e.currentTarget.value)} value={value}>
      <option value="" disabled>
        -- Select Playlist --
      </option>
      {data?.data.map((playlist) => (
        <option key={playlist.id} value={playlist.id}>
          {playlist.attributes.title}
        </option>
      ))}
    </select>
  )
}
