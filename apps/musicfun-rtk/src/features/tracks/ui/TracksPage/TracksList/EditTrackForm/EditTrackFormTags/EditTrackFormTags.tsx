import type { Dispatch, SetStateAction } from 'react'
import s from '../EditTrackForm.module.css'
import { useFindTagsQuery } from '@/features/tags/api/tagsApi.ts'

type Props = {
  tagIds: string[]
  setTagIds: Dispatch<SetStateAction<string[]>>
}

export const EditTrackFormTags = ({ tagIds, setTagIds }: Props) => {
  const { data: tagsResponse } = useFindTagsQuery({ value: '' })

  const toggleTag = (tagId: string) => {
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <div>
      <h4 className={s.subTitle}>Select Tag from List</h4>
      <div className={'tagsList'}>
        {tagsResponse?.map((tag) => {
          const isSelected = tagIds.includes(tag.id)
          return (
            <div
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`tagItem ${isSelected ? 'selectedTag' : ''}`}
            >
              # {tag.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
