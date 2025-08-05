import type { PlaylistType } from '../PlaylistsPage'

type Props = {
  type: PlaylistType
  setType: (type: PlaylistType) => void
}

export const PlaylistTypeSwitcher = ({ type, setType }: Props) => {
  return (
    <div>
      <button onClick={() => setType('all')} disabled={type === 'all'}>
        All Playlists
      </button>
      <button onClick={() => setType('my')} disabled={type === 'my'}>
        My Playlists
      </button>
    </div>
  )
}
