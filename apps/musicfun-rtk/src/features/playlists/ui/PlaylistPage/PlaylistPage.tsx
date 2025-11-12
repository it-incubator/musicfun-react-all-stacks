import { Loader, PageTitle } from '@/common/components'
import { Path } from '@/common/routing'
import { useFetchPlaylistByIdQuery } from '../../api/playlistsApi'
import { Link, Navigate, useLocation, useParams } from 'react-router'
import { PlaylistCover } from '../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistCover/PlaylistCover'
import { PlaylistDescription } from '../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistDescription/PlaylistDescription'
import { PlaylistTracks } from './PlaylistTracks/PlaylistTracks'
import { useGetMeQuery } from '@/features/auth/api/auth-api'
import { PlaylistActions } from '../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistActions/PlaylistActions'
import { useRemovePlaylist } from '@/features/playlists/lib/hooks/useRemovePlaylist'
import { useUpdatePlaylist } from '@/features/playlists/lib/hooks/useUpdatePlaylist'
import { EditPlaylistForm } from '../PlaylistsPage/PlaylistsList/EditPlaylistForm/EditPlaylistForm'

export const PlaylistPage = () => {
  const { playlistId } = useParams<{ playlistId?: string }>()
  const { data: userData } = useGetMeQuery()
  const { removePlaylist } = useRemovePlaylist()
  const { editPlaylist, playlistId: editingId, register, handleSubmit, onSubmit, errors, control } = useUpdatePlaylist()
  const location = useLocation()
  const from = location.state?.from || Path.Playlists

  const { data, isLoading } = useFetchPlaylistByIdQuery(playlistId as string, {
    skip: !playlistId,
  })

  if (!playlistId) return <Navigate to={Path.NotFound} />

  if (isLoading) return <Loader />

  if (!data) return <h1>Playlist not found</h1>

  const isMyPlaylist = userData?.userId === data.data.attributes.user.id
  return (
    <>
      <Link className={'link'} to={from}>
        Back
      </Link>
      <PageTitle>Playlist Information</PageTitle>
      <div>
        <PlaylistCover playlist={data.data} editable={isMyPlaylist} />
        <PlaylistDescription attributes={data.data.attributes} />
        {isMyPlaylist &&
          (editingId === data.data.id ? (
            <EditPlaylistForm
              errors={errors}
              onSubmit={onSubmit}
              editPlaylist={editPlaylist}
              handleSubmit={handleSubmit}
              register={register}
              control={control}
            />
          ) : (
            <PlaylistActions playlist={data.data} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
          ))}
      </div>
      <PlaylistTracks />
    </>
  )
}
