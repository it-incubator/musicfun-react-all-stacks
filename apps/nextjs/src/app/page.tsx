import { UserBlock } from '@/features/auth/ui/UserBlock'
import { tracksApi } from '@/shared/api/tracks/tracksApi'

import styles from './page.module.css'

export default async function Home() {
  const tracks = await tracksApi.fetchTracks({ pageNumber: 1, pageSize: 5 })

  return (
    <div className={styles.page}>
      <header>
        <UserBlock />
      </header>
      <h2>Tracks:</h2>
      {tracks.data.map((track) => (
        <li key={track.id}>{track.attributes.title}</li>
      ))}
    </div>
  )
}
