import { playlistsKey } from '@/common/apiEntities'
import { Loader, PageTitle } from '@/common/components'
import { Path } from '@/common/routing'
import { playlistsApi } from '../../api/playlistsApi.ts'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useParams } from 'react-router'
import { PlaylistCover } from '../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistCover/PlaylistCover.tsx'
import { PlaylistDescription } from '../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx'
import { PlaylistTracks } from './PlaylistTracks/PlaylistTracks.tsx'

export const PlaylistPage = () => {
  const { playlistId } = useParams<{ playlistId?: string }>()

  const { data, isPending } = useQuery({
    queryKey: [playlistsKey, playlistId],
    queryFn: () => playlistsApi.fetchPlaylistById(playlistId as string),
    enabled: !!playlistId,
  })

  if (!playlistId) return <Navigate to={Path.NotFound} />

  if (isPending) return <Loader />

  if (!data) return <h1>Плейлист не найден</h1>

  return (
    <>
      <Link className={'link'} to={Path.Playlists}>
        Вернуться назад
      </Link>
      <PageTitle>Информация о плейлисте</PageTitle>
      <div>
        <PlaylistCover playlist={data?.data.data} />
        <PlaylistDescription attributes={data?.data.data.attributes} />
      </div>
      <PlaylistTracks />
    </>
  )
}
