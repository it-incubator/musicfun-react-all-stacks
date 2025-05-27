import { useParams } from "react-router"

export const TrackPage = () => {
  const { id } = useParams<string>()

  return (
    <div>
      <h1>TrackPage</h1>
      <h2>id: {id}</h2>
    </div>
  )
}
