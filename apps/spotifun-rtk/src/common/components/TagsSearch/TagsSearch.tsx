import { useFindTagsQuery } from '@/features/tags/api/tagsApi.ts'
import { SearchInput } from '@/common/components'
import { useEffect, useState } from 'react'
import { useDebounceValue } from '@/common/hooks'
import s from './TagsSearch.module.css'
import type { Tag } from '@/features/tags/api/tagsApi.types.ts'

type Props = {
  setValues: (tags: string[]) => void
}

export const TagsSearch = ({ setValues }: Props) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)
  const { data: options, isLoading } = useFindTagsQuery({ value: debouncedSearch })

  const [selectedTags, setSelectedTags] = useState<Tag[] | []>([])

  const [isOpen, setIsOpen] = useState(false)

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

  const isSelected = (id: string) => selectedTags.some((selected) => selected.id === id)

  return (
    <div className={s.container}>
      <h2>Поиск по тегу</h2>
      <div className={s.inputWrapper} onClick={() => setIsOpen(true)}>
        {selectedTags.slice(0, 4).map((tag) => (
          <span key={tag.id} className={s.tag}>
            {tag.name}
            <button
              className={s.removeButton}
              onClick={() => {
                removeTagFromSelected(tag.id)
              }}
            >
              ×
            </button>
          </span>
        ))}
        {selectedTags.length > 4 && <span className={s.more}>and {selectedTags.length - 4} more</span>}
        <SearchInput
          title={''}
          isPending={isLoading}
          placeholder={'Выберите тег'}
          search={debouncedSearch}
          setSearch={setSearch}
          autoFocus={false}
        />
      </div>
      <button onClick={() => setIsOpen(false)}>close</button>
      {isOpen && (
        <div className={s.dropdown}>
          {options?.map((option) => (
            <div>
              <input type={'checkbox'} checked={isSelected(option.id)} />
              <span
                className={s.option}
                key={option.id}
                onClick={() => {
                  addTagToSelected(option)
                }}
              >
                {option.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
