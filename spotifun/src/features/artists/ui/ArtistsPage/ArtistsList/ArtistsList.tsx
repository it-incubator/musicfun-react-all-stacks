import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArtistQueryKey, artistsApi } from "../../../api/artistsApi.ts"
import { ArtistItem } from "./ArtistItem/ArtistItem.tsx"
import { ArtistSearch } from "./ArtistSearch/ArtistSearch.tsx"

export const ArtistsList = () => {
  const [search, setSearch] = useState("")

  const { data } = useQuery({
    queryKey: [ArtistQueryKey, search],
    queryFn: () => artistsApi.findArtists(search),
  })

  return (
    <>
      <ArtistSearch search={search} setSearch={setSearch} />
      <h2>Список артистов</h2>
      {data?.data.map((artist) => {
        return <ArtistItem artist={artist} key={artist.id} />
      })}
    </>
  )
}
