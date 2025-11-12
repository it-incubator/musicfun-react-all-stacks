import { Path } from '@/common/routing'
import { useReorderTracks } from '@/features/tracks/lib/hooks/useReorderTracks.ts'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { Navigate, useParams } from 'react-router'
import type { PlaylistItemAttributes } from '@/modules/musicstaff/tracks/api/tracksApi.types.ts'
import { useEditTrack } from '@/modules/musicstaff/tracks/lib/hooks/useEditTrack.ts'
import { useRemoveTrack } from '@/modules/musicstaff/tracks/lib/hooks/useRemoveTrack.ts'
import { EditTrackForm } from '@/modules/musicstaff/tracks/ui/TracksPage/TracksList/EditTrackForm/EditTrackForm.tsx'
import { TrackItem } from '@/modules/musicstaff/tracks/ui/TracksPage/TracksList/TrackItem/TrackItem.tsx'
import { useFetchTracksInPlaylist } from '../../../lib/hooks/useFetchTracksInPlaylist.ts'
import { useRemoveTrackFromPlaylist } from '../../../lib/hooks/useRemoveTrackFromPlaylist.ts'
import { SortableItem } from '../../PlaylistsPage/PlaylistsList/SortableItem/SortableItem.tsx'
import s from './PlaylistTracks.module.css'

export const PlaylistTracks = () => {
  const { playlistId } = useParams<{ playlistId?: string }>()

  const { initialTracks } = useFetchTracksInPlaylist(playlistId)
  const { register, handleSubmit, onSubmit, trackId, editTrack, tagIds, setTagIds, artistsIds, setArtistsIds } =
    useEditTrack()
  const { removeTrackFromPlaylist } = useRemoveTrackFromPlaylist(playlistId)
  const { removingTrackId, removeTrack } = useRemoveTrack()
  const { tracks, handleDragEnd } = useReorderTracks(initialTracks, playlistId ?? '')

  if (!playlistId) return <Navigate to={Path.NotFound} />

  if (tracks.length === 0) return <h2>В данном плейлисте треков нет 😢</h2>

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={tracks}>
        <h2>Треки</h2>
        {tracks.map((track) => {
          const isEditing = trackId === track.id

          return (
            <div key={track.id} className={s.container}>
              {isEditing ? (
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
                <SortableItem id={track.id} title={track.attributes.title}>
                  <TrackItem<PlaylistItemAttributes> track={track}>
                    <div className={'trackActions'}>
                      <button onClick={(e) => editTrack(e, track.id)}>Редактировать</button>
                      <button onClick={(e) => removeTrackFromPlaylist(e, track.id)}>Удалить трек из плейлиста</button>
                      <button onClick={(e) => removeTrack(e, track.id)} disabled={removingTrackId === track.id}>
                        {removingTrackId === track.id ? 'Удаление...' : 'Удалить'}
                      </button>
                    </div>
                  </TrackItem>
                </SortableItem>
              )}
            </div>
          )
        })}
      </SortableContext>
    </DndContext>
  )
}
