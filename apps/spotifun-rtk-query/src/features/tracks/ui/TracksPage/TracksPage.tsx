import { useFetchTracksQuery } from "../../api/tracksApi.ts"

export const TracksPage = () => {
  const { data, error, isError, isLoading } = useFetchTracksQuery({
    pageNumber: 1,
    pageSize: 10,
    search: "",
  })

  if (isLoading) return <span>loading...</span>

  if (isError) return <span>{JSON.stringify(error)}</span>

  return (
    <div>
      <h1>Треки</h1>
      <ul>
        {data?.data.map((t) => {
          return <li>{t.attributes.title}</li>
        })}
      </ul>
    </div>
  )
}
