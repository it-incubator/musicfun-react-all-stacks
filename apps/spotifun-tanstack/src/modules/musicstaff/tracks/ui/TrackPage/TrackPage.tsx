import { tracksKey } from '@/common/apiEntities'
import { Loader, PageTitle } from '@/common/components'
import { Path } from '@/common/routing'
import type { TrackDetailAttributes } from '../../api/tracksApi.types.ts'
import { tracksApi } from '../../api/tracksApi.ts'
import { useAddToPlaylist } from '../../lib/hooks/useAddToPlaylist.ts'
import { useEditTrack } from '../../lib/hooks/useEditTrack.ts'
import { useRemoveTrack } from '../../lib/hooks/useRemoveTrack.ts'
import { EditTrackForm } from '../TracksPage/TracksList/EditTrackForm/EditTrackForm.tsx'
import { Reactions } from '../TracksPage/TracksList/TrackItem/Reactions/Reactions.tsx'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { AddTrackToPlaylistModal } from '../TracksPage/AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx'
import { TrackItem } from '../TracksPage/TracksList/TrackItem/TrackItem.tsx'

export const TrackPage = () => {
  const navigate = useNavigate()

  const { trackId: id } = useParams<{ trackId?: string }>()

  const { data, isPending } = useQuery({
    queryKey: [tracksKey, id],
    queryFn: () => tracksApi.fetchTrackById(id as string),
  })

  const { removingTrackId, removeTrack } = useRemoveTrack(() => navigate(Path.Tracks))
  const { modalTrackId, setModalTrackId, addTrackToPlaylist, openModal } = useAddToPlaylist()
  const { register, handleSubmit, onSubmit, trackId, editTrack, tagIds, setTagIds, artistsIds, setArtistsIds } =
    useEditTrack()

  if (!id) return <Navigate to={Path.NotFound} />

  if (isPending) return <Loader />

  if (!data) return <h1>Трек не найден</h1>

  const track = data?.data.data

  return (
    <>
      <AddTrackToPlaylistModal
        open={!!modalTrackId}
        onClose={() => setModalTrackId(null)}
        onSave={addTrackToPlaylist}
      />
      <>
        <Link className={'link'} to={Path.Tracks}>
          Вернуться назад
        </Link>
        <PageTitle>Информация о треке</PageTitle>

        {trackId ? (
          <EditTrackForm
            register={register}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            tagIds={tagIds}
            setTagIds={setTagIds}
            artistsIds={artistsIds}
            setArtistsIds={setArtistsIds}
            editTrack={(e) => editTrack(e, null)}
          />
        ) : (
          <TrackItem<TrackDetailAttributes> track={track}>
            <div className={'trackActions'}>
              <Reactions
                currentUserReaction={track.attributes.currentUserReaction}
                likesCount={track.attributes.likesCount}
                dislikesCount={track.attributes.dislikesCount}
                trackId={id}
              />
              <button onClick={(e) => openModal(e, id)}>Добавить трек в плейлист</button>
              <button onClick={(e) => editTrack(e, id)}>Редактировать</button>
              <button onClick={(e) => removeTrack(e, id)} disabled={removingTrackId === id}>
                {removingTrackId === id ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </TrackItem>
        )}
      </>
    </>
  )
}
