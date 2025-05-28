import { useQuery } from "@tanstack/react-query"
import { Layout, PageTitle } from "@/common/components"
import { AddTrackForm } from "./AddTrackForm/AddTrackForm.tsx"
import { TracksList } from "./TracksList/TracksList.tsx"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"

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
      <AddTrackForm />
      <TracksList tracks={data?.data.data || []} />
    </Layout>
  )
}
