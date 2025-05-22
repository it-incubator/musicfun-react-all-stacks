import { Layout, PageTitle } from "@/common"
import { useQuery } from "@tanstack/react-query"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"
import s from "./TracksPage.module.css"

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
      <div className={s.container}>
        {data?.data.data.map((track) => {
          const { title, addedAt } = track.attributes

          return (
            <div className={"item"}>
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
