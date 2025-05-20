import { useQuery } from "@tanstack/react-query"
import { playlistsApi } from "../../api/playlistsApi.ts"
import s from "./Playlists.module.css"

export const Playlists = () => {
  const { data, isPending } = useQuery({ queryKey: ["playlists"], queryFn: playlistsApi.getPlaylists })

  if (isPending) {
    return <span>Loading...</span>
  }

  return (
    <>
      <h1>Playlists</h1>
      <div>
        {data?.data.data.map((playlist) => {
          const { attributes } = playlist

          return (
            <div key={playlist.id} className={s.item}>
              <div>
                <div>
                  <b>title:</b> <span>{attributes.title}</span>
                </div>
                <div>
                  <b>description:</b> <span>{attributes.description}</span>
                </div>
                <div>
                  <b>added date:</b> <span>{new Date(attributes.addedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
