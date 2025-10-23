import { reatomComponent } from '@reatom/react'
import { useEffect, useState } from 'react'
import { list } from './model.tsx'
import { PlaylistItem } from '../../entities/playlist'

const Paging = reatomComponent(() => {
  const [page, setPage] = useState(1)

  useEffect(() => {
    list.load(page)
  }, [page])

  const isLoading = list.isLoading()

  return (
    <button onClick={() => setPage((page) => page + 1)} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Next page'}
    </button>
  )
})

export const PlaylistsPage = reatomComponent(() => (
  <section>
    <Paging />
    {list()?.data.map((p) => <PlaylistItem playlist={p} key={p.id} />)}
  </section>
))
