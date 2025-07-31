import { Loader, PageTitle } from '@/common/components'
import { Path } from '@/common/routing'
import type { TrackDetailAttributes } from '../../api/tracksApi.types.ts'
import { useAddToPlaylist } from '../../lib/hooks/useAddToPlaylist.ts'
import { useEditTrack } from '../../lib/hooks/useEditTrack.ts'
import { useRemoveTrack } from '../../lib/hooks/useRemoveTrack.ts'
import { EditTrackForm } from '../TracksPage/TracksList/EditTrackForm/EditTrackForm.tsx'
import { Reactions } from '../TracksPage/TracksList/TrackItem/Reactions/Reactions.tsx'

import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { AddTrackToPlaylistModal } from '../TracksPage/AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx'
import { TrackItem } from '../TracksPage/TracksList/TrackItem/TrackItem.tsx'
import { useFetchTrackByIdQuery } from '@/features/tracks/api/tracksApi.ts'

export const TrackPage = () => {
  const navigate = useNavigate()

  const { trackId: id } = useParams<{ trackId?: string }>()

  const { data, isLoading } = useFetchTrackByIdQuery({ trackId: id || '' })

  const { removingTrackId, removeTrack } = useRemoveTrack(() => navigate(Path.Tracks))
  const { modalTrackId, setModalTrackId, addTrackToPlaylist, openModal } = useAddToPlaylist()
  const { register, errors, handleSubmit, onSubmit, trackId, editTrack, tagIds, setTagIds, artistsIds, setArtistsIds } =
    useEditTrack()

  if (!id) return <Navigate to={Path.NotFound} />

  if (isLoading) return <Loader />

  if (!data) return <h1>Track not found</h1>

  const track = data?.data

  return (
    <>
      <AddTrackToPlaylistModal
        open={!!modalTrackId}
        onClose={() => setModalTrackId(null)}
        onSave={addTrackToPlaylist}
      />
      <>
        <Link className={'link'} to={Path.Tracks}>
          Back
        </Link>
        <PageTitle>Track Information</PageTitle>

        {trackId ? (
          <EditTrackForm
            errors={errors}
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
              <button onClick={(e) => openModal(e, id)}>Add Track to Playlist</button>
              <button onClick={(e) => editTrack(e, id)}>Edit</button>
              <button onClick={(e) => removeTrack(e, id)} disabled={removingTrackId === id}>
                {removingTrackId === id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </TrackItem>
        )}
      </>
    </>
  )
}
