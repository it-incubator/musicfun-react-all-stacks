import { useState } from "react"
import { SearchInput } from "@/common/components"
import { useDebounceValue } from "@/common/hooks"
import { ArtistItem } from "./ArtistItem/ArtistItem.tsx"
import { useFindArtistsQuery } from "../../../api/artistsApi.ts"

export const ArtistsList = () => {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search)

  const { data, isLoading } = useFindArtistsQuery(debouncedSearch)

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={isLoading}
        title="Поиск по имени артиста"
        placeholder="Введите имя"
      />
      {Array.isArray(data) && data.length ? (
        <div>
          <h2>Список артистов</h2>
          {data?.map((artist) => {
            return <ArtistItem artist={artist} key={artist.id} />
          })}
        </div>
      ) : (
        <h2>По заданному условию артисты не найдены. Измените параметры поиска</h2>
      )}
    </>
  )
}
