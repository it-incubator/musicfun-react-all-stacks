import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/shared/api'
import { useState } from 'react'

export const Playlists = ({ filtersEnabled = false }: { filtersEnabled: boolean }) => {
  const [search, setSearch] = useState('')

  const query = useQuery({
    queryKey: ['playlists', search],
    queryFn: () => {
      return getClient().GET('/playlists', {
        params: {
          query: {
            search,
          },
        },
      })
    },
  })

  console.log('Playlists rendered')

  if (query.isPending) {
    return <span>Loading...</span>
  }

  if (query.isError) {
    return <span>Error: {query.error.message}</span>
  }

  return (
    <div>
      <QueryStatus query={query} />
      {filtersEnabled && (
        <div>
          <input value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
        </div>
      )}
      <ul>
        {query.data.data!.data.map((playlist) => (
          <li key={playlist.id}>{playlist.attributes.title}</li>
        ))}
      </ul>
    </div>
  )
}

function QueryStatus(props: any) {
  return (
    <div>
      <div>status: {props.query.status}</div>
      <div>fetchStatus: {props.query.fetchStatus}</div>
    </div>
  )
}
