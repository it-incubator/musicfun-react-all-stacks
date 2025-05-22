import { Layout, PageTitle } from "@/common"
import { TrackQueryKey, tracksApi } from "@/features/tracks/api/tracksApi.ts"
import { useQuery } from "@tanstack/react-query"

export const TracksPage = () => {
  const { data, isPending } = useQuery({
    queryKey: [TrackQueryKey],
    queryFn: tracksApi.fetchTracks,
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  return (
    <Layout>
      <PageTitle>Страница треков</PageTitle>
      <div>
        {data?.data.data.map((track) => {
          const { title, addedAt } = track.attributes

          return (
            <div>
              <div>
                <b>title:</b> <span>{title}</span>
              </div>
              <div>
                <b>added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
