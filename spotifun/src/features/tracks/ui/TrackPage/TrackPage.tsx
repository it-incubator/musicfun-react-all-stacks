import { Layout, Loader, PageTitle } from "@/common/components"
import { Path } from "@/common/routing"
import { useRemoveTrack } from "@/features/tracks/lib/hooks/useRemoveTrack.ts"
import { useQuery } from "@tanstack/react-query"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"
import type { TrackDetailAttributes } from "../../api/tracksApi.types.ts"
import { TrackItem } from "../TracksPage/TracksList/TrackItem/TrackItem.tsx"

export const TrackPage = () => {
  const navigate = useNavigate()

  const { trackId } = useParams<{ trackId?: string }>()

  const { data, isPending } = useQuery({
    queryKey: [TrackQueryKey, trackId],
    queryFn: () => tracksApi.fetchTrackById(trackId as string),
  })

  const { removingTrackId, removeTrack } = useRemoveTrack(() => {
    navigate(Path.Tracks)
  })

  if (!trackId) return <Navigate to={Path.NotFound} />

  if (isPending) return <Loader />

  if (!data) return <h1>Трек не найден</h1>

  return (
    <Layout>
      <Link className={"link"} to={Path.Tracks}>
        Вернуться назад
      </Link>
      <PageTitle>Информация о треке</PageTitle>
      <TrackItem<TrackDetailAttributes> track={data?.data.data}>
        <div>
          <button onClick={(e) => removeTrack(e, trackId)} disabled={removingTrackId === trackId}>
            {removingTrackId === trackId ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </TrackItem>
    </Layout>
  )
}
