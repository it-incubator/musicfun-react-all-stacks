import { SearchInput } from "@/common/components"
import { useDebounceValue } from "@/common/hooks"
import { useFindTagsQuery } from "../../../api/tagsApi.ts"
import { TagItem } from "./TagItem/TagItem.tsx"
import { useState } from "react"

export const TagsList = () => {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search)

  const { data, isLoading: isPending } = useFindTagsQuery({value: debouncedSearch })

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={isPending}
        title="Поиск по тегу"
        placeholder="Введите тег"
      />
      {Array.isArray(data) && data.length ? (
        <div>
          <h2>Список тегов</h2>
          {data?.map((tag) => {
            return <TagItem tag={tag} key={tag.id} />
          })}
        </div>
      ) : (
        <h2>По заданному условию теги не найдены. Измените параметры поиска</h2>
      )}
    </>
  )
}
