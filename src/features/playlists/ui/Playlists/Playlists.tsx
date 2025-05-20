import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { playlistsApi } from "../../api/playlistsApi"
import s from "./Playlists.module.css"

export const Playlists = () => {
  const [type, setType] = useState<"all" | "my">("all")

  const { data, isPending } = useQuery({
    queryKey: ["playlists", type],
    queryFn: () => (type === "all" ? playlistsApi.getPlaylists() : playlistsApi.getMyPlaylists()),
  })

  return (
    <>
      <h1>Playlists</h1>

      <div>
        <button onClick={() => setType("all")} disabled={type === "all"}>
          Все плейлисты
        </button>
        <button onClick={() => setType("my")} disabled={type === "my"}>
          Мои плейлисты
        </button>
      </div>

      {isPending ? (
        <span>Loading...</span>
      ) : (
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
      )}
    </>
  )
}
