import type { PlaylistItem } from "../../../api/playlistsApi.types"
import s from "./PlaylistsList.module.css"

type Props = {
  playlists: PlaylistItem[]
}

export const PlaylistsList = ({ playlists }: Props) => {
  return (
    <div className={s.container}>
      {playlists.map((playlist) => {
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
  )
}
