import { toast } from "react-toastify"
import { useFetchTracksQuery } from "../../api/tracksApi.ts"

export const TracksPage = () => {
  const { data, isLoading, error } = useFetchTracksQuery({
    pageNumber: 1,
    pageSize: 10,
    search: "",
  })

  if (isLoading) return <span>loading...</span>

  if (error) {
    toast(JSON.stringify(error), { theme: "colored", type: "error" })
  }

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
