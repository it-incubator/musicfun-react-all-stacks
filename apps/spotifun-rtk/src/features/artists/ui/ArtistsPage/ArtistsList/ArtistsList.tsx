import { SearchInput } from "@/common/components/SearchInput/SearchInput.tsx"
import { useState } from "react"
import { ArtistItem } from "@/features/artists/ui/ArtistsPage/ArtistsList/ArtistItem/ArtistItem.tsx"
import { useFindArtistsQuery } from "@/features/artists/api/artistsApi.ts"
import { useDebounceValue } from "@/common/hooks"

export const ArtistsList = () => {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search)
  const { data, isLoading } = useFindArtistsQuery(debouncedSearch)
  const isPending = isLoading || search !== debouncedSearch

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={isPending}
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
