import { SearchInput } from "@/common/components/SearchInput/SearchInput.tsx"
import { useState } from "react"
import { ArtistItem } from "@/features/artists/ui/ArtistsPage/ArtistsList/ArtistItem/ArtistItem.tsx"
import { useFindArtistsQuery } from "@/features/artists/api/artistsApi.ts"
// import type { Artist } from "@it-incubator/spotifun-api-sdk"

export const ArtistsList = () => {
  const [search, setSearch] = useState("")

  const { data } = useFindArtistsQuery(search)

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={false}
        title="Поиск по имени артиста"
        placeholder="Введите имя"
      />
      {Array.isArray(data) && data.length ? (
        <div>
          <h2>Список артистов</h2>
          {data.map((artist) => {
            return <ArtistItem artist={artist} key={artist.id} />
          })}
        </div>
      ) : (
        <h2>По заданному условию артисты не найдены. Измените параметры поиска</h2>
      )}
    </>
  )
}
