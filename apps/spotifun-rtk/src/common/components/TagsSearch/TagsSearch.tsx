import { useFindTagsQuery } from "@/features/tags/api/tagsApi.ts"
import { SearchInput } from "@/common/components"
import { useEffect, useState } from "react"
import { useDebounceValue } from "@/common/hooks"
import s from "./TagsSearch.module.css"
import type { Tag } from "@/features/tags/api/tagsApi.types.ts"

type Props = {
  setValues: (tags: string[]) => void
}

export const TagsSearch = ({ setValues }: Props) => {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search)
  const { data: options, isLoading } = useFindTagsQuery({ value: debouncedSearch })

  const [selectedTags, setSelectedTags] = useState<Tag[] | []>([])

  useEffect(() => {
    setValues(selectedTags.map((t) => t.id))
  }, [selectedTags, setValues])

  const addTagToSelected = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([tag, ...selectedTags])
    }
  }

  const removeTagFromSelected = (id: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== id))
  }

  return (
    <div>
      <div className={s.inputWrapper}>
        <SearchInput
          isPending={isLoading}
          placeholder={"поиск"}
          search={debouncedSearch}
          setSearch={setSearch}
          title={"Поиск по тегу"}
        />
        <ul className={s.listItems}>
          {selectedTags.map((tag) => (
            <li
              key={tag.id}
              onClick={() => {
                removeTagFromSelected(tag.id)
              }}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {options?.map((option) => (
          <li
            key={option.id}
            onClick={() => {
              addTagToSelected(option)
            }}
          >
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
