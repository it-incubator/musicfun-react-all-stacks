import type { PlaylistType } from "../PlaylistsPage.tsx"

type Props = {
  type: PlaylistType
  setType: (type: PlaylistType) => void
}

export const PlaylistTypeSwitcher = ({ type, setType }: Props) => {
  return (
    <div>
      <button onClick={() => setType("all")} disabled={type === "all"}>
        Все плейлисты
      </button>
      <button onClick={() => setType("my")} disabled={type === "my"}>
        Мои плейлисты
      </button>
    </div>
  )
}
