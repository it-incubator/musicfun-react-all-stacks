import { playlistsKey } from '@/common/apiEntities'
import { playlistsApi } from '@/modules/musicstaff/playlists/api/playlistsApi.ts'
import { useQuery } from '@tanstack/react-query'

type Props = {
  onChange: (value: string) => void
  value: string
}

export const SelectPlaylists = ({ onChange, value }: Props) => {
  const { data } = useQuery({ queryKey: [playlistsKey, 'my'], queryFn: playlistsApi.fetchMyPlaylists })

  return (
    <select onChange={(e) => onChange(e.currentTarget.value)} value={value}>
      <option value="" disabled>
        -- Выберите плейлист --
      </option>
      {data?.data.data.map((playlist) => (
        <option key={playlist.id} value={playlist.id}>
          {playlist.attributes.title}
        </option>
      ))}
    </select>
  )
}
