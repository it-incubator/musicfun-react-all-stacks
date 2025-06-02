import s from "@/features/artists/ui/ArtistsPage/ArtistsList/ArtistSearch/ArtistSearch.module.css"
import { tagsApi, TagsQueryKey } from "@/features/tags/api/tagsApi.ts"
import { TagItem } from "@/features/tags/ui/TagsPage/TagsList/TagItem/TagItem.tsx"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export const TagsList = () => {
  const [search, setSearch] = useState("")

  const { data } = useQuery({
    queryKey: [TagsQueryKey, search],
    queryFn: () => tagsApi.findTags(search),
  })

  return (
    <div>
      <>
        <h1>TagsList</h1>
        <input
          className={s.search}
          placeholder="Введите тег"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          autoFocus
        />
      </>
      {Array.isArray(data?.data) && data.data.length ? (
        <div>
          <h2>Список тегов</h2>
          {data?.data.map((tag) => {
            return <TagItem tag={tag} key={tag.id} />
          })}
        </div>
      ) : (
        <h2>По заданному условию теги не найдены. Измените параметры поиска</h2>
      )}
    </div>
  )
}
