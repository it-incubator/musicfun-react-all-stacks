import { useFetchTracksQuery } from "../../api/tracksApi.ts"

export const TracksPage = () => {
  const { data, isLoading } = useFetchTracksQuery({
    pageNumber: 1,
    pageSize: 10,
    search: "",
  })

  if (isLoading) return <span>loading...</span>

  return (
    <div>
      <h1>Треки</h1>
      <ul>
        {data?.data.map((t) => {
          return <li key={t.id}>{t.attributes.title}</li>
        })}
      </ul>
    </div>
  )
}
