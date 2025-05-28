import { Link, Navigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Layout, PageTitle, Path } from "@/common"
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

  if (isPending) {
    return <h1>Loading...</h1>
  }

  if (!data) {
    return <h1>Трек не найден</h1>
  }

  return (
    <Layout>
      <Link className={"link"} to={Path.Tracks}>
        Вернуться назад
      </Link>
      <PageTitle>Информация о треке</PageTitle>
      <TrackItem track={data?.data.data} />
    </Layout>
  )
}
