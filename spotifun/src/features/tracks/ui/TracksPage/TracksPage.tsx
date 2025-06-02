import { tracksKey } from "@/common/apiEntities"
import { Loader, PageTitle } from "@/common/components"
import { useQuery } from "@tanstack/react-query"
import { tracksApi } from "../../api/tracksApi.ts"
import { AddTrackForm } from "./AddTrackForm/AddTrackForm.tsx"
import { TracksList } from "./TracksList/TracksList.tsx"

export const TracksPage = () => {
  const { data, isPending } = useQuery({ queryKey: [tracksKey], queryFn: tracksApi.fetchTracks })

  if (isPending) return <Loader />

  return (
    <>
      <PageTitle>Страница треков</PageTitle>
      <AddTrackForm />
      <TracksList tracks={data?.data.data || []} />
    </>
  )
}
