import { Link, Navigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Path } from "@/common/routing"
import { Layout, Loader, PageTitle } from "@/common/components"
import type { TrackDetailAttributes } from "../../api/tracksApi.types.ts"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"
import { TrackItem } from "../TracksPage/TracksList/TrackItem/TrackItem.tsx"

export const TrackPage = () => {
  const { trackId } = useParams<{ trackId: string }>()

  if (!trackId) {
    return <Navigate to={Path.NotFound} />
  }

  const { data, isPending } = useQuery({
    queryKey: [TrackQueryKey, trackId],
    queryFn: () => tracksApi.fetchTrackById(trackId),
  })

  if (isPending) return <Loader />

  if (!data) return <h1>Трек не найден</h1>

  return (
    <Layout>
      <Link className={"link"} to={Path.Tracks}>
        Вернуться назад
      </Link>
      <PageTitle>Информация о треке</PageTitle>
      <TrackItem<TrackDetailAttributes> track={data?.data.data} />
    </Layout>
  )
}
