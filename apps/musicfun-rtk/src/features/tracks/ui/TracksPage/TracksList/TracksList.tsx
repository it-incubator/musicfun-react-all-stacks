import { ArtistsSearch, Loader, TagsSearch } from '@/common/components'
import type { FetchTracksAttributes } from '../../../api/tracksApi.types.ts'
import { useFetchTracks } from '../../../lib/hooks/useFetchTracks.ts'
import { useAddToPlaylist } from '../../../lib/hooks/useAddToPlaylist.ts'
import { useEditTrack } from '../../../lib/hooks/useEditTrack.ts'
import { useRemoveTrack } from '../../../lib/hooks/useRemoveTrack.ts'
import { AddTrackToPlaylistModal } from '../AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx'
import { EditTrackForm } from './EditTrackForm/EditTrackForm.tsx'
import { TrackItem } from './TrackItem/TrackItem.tsx'
import s from './TracksList.module.css'
import { useInfiniteScrollTrigger } from '@/common/hooks'
import { useState } from 'react'

export const TracksList = () => {
  const [page, setPage] = useState(1)

  const { register, handleSubmit, onSubmit, trackId, editTrack, tagIds, setTagIds, artistsIds, setArtistsIds, errors } =
    useEditTrack()

  const { tracks, isFetching, isLoading, hasNextPage } = useFetchTracks({
    pageNumber: page,
    artistsIds,
    tagsIds: tagIds,
  })
  const { removingTrackId, removeTrack } = useRemoveTrack()
  const { modalTrackId, setModalTrackId, addTrackToPlaylist, openModal } = useAddToPlaylist()

  const { triggerRef } = useInfiniteScrollTrigger({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage: isFetching,
    callback: () => {
      setPage((prev) => prev + 1)
    },
  })

  return (
    <div className={s.container}>
      <ArtistsSearch setValues={setArtistsIds} selectedIds={artistsIds} />
      <TagsSearch setValues={setTagIds} selectedIds={tagIds} />
      <AddTrackToPlaylistModal
        open={!!modalTrackId}
        onClose={() => setModalTrackId(null)}
        onSave={addTrackToPlaylist}
      />
      {tracks?.map((track) => {
        const isEditing = trackId === track.id
        return (
          <div key={track.id}>
            {isEditing ? (
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
              <TrackItem<FetchTracksAttributes> track={track}>
                <div className={'trackActions'}>
                  <button onClick={(e) => openModal(e, track.id)}>Add Track to Playlist</button>
                  <button onClick={(e) => editTrack(e, track.id)}>Edit</button>
                  <button onClick={(e) => removeTrack(e, track.id)} disabled={removingTrackId === track.id}>
                    {removingTrackId === track.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </TrackItem>
            )}
          </div>
        )
      })}
      {/* Infinity Scroll Trigger */}
      {!isLoading && <div ref={triggerRef} style={{ height: '1px' }} />}
      {isLoading && <Loader />}
      {!hasNextPage && !isFetching && <p>All tracks loaded</p>}
    </div>
  )
}
