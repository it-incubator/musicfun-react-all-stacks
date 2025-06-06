import { tracksKey } from "@/common/apiEntities"
import { Loader, PageTitle } from "@/common/components"
import { Path } from "@/common/routing"
import { useAddToPlaylist } from "@/features/tracks/lib/hooks/useAddToPlaylist.ts"
import { useEditTrack } from "@/features/tracks/lib/hooks/useEditTrack.ts"
import { useRemoveTrack } from "@/features/tracks/lib/hooks/useRemoveTrack.ts"
import { AddTrackToPlaylistModal } from "../TracksPage/AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx"
import { EditTrackForm } from "@/features/tracks/ui/TracksPage/TracksList/EditTrackForm/EditTrackForm.tsx"
import { useQuery } from "@tanstack/react-query"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { tracksApi } from "../../api/tracksApi.ts"
import type { TrackDetailAttributes } from "../../api/tracksApi.types.ts"
import { TrackItem } from "../TracksPage/TracksList/TrackItem/TrackItem.tsx"

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

  return (
    <>
      <AddTrackToPlaylistModal
        open={!!modalTrackId}
        onClose={() => setModalTrackId(null)}
        onSave={addTrackToPlaylist}
      />
      <>
        <Link className={"link"} to={Path.Tracks}>
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
          <TrackItem<TrackDetailAttributes> track={data?.data.data}>
            <div className={"trackActions"}>
              <button onClick={(e) => openModal(e, id)}>Добавить трек в плейлист</button>
              <button onClick={(e) => editTrack(e, id)}>Редактировать</button>
              <button onClick={(e) => removeTrack(e, id)} disabled={removingTrackId === id}>
                {removingTrackId === id ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </TrackItem>
        )}
      </>
    </>
  )
}
