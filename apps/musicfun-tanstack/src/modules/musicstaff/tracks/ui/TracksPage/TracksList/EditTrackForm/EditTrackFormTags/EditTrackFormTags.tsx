import { tagsKey } from '@/common/apiEntities'
import { tagsApi } from '@/modules/musicstaff/tags/api/tagsApi.ts'
import { useQuery } from '@tanstack/react-query'
import type { Dispatch, SetStateAction } from 'react'
import s from '../EditTrackForm.module.css'

type Props = {
  tagIds: string[]
  setTagIds: Dispatch<SetStateAction<string[]>>
}

export const EditTrackFormTags = ({ tagIds, setTagIds }: Props) => {
  const { data: tagsResponse } = useQuery({ queryKey: [tagsKey], queryFn: () => tagsApi.findTags('') })

  const toggleTag = (tagId: string) => {
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <div>
      <h4 className={s.subTitle}>Выбери тег из списка</h4>
      <div className={'tagsList'}>
        {tagsResponse?.data.map((tag) => {
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
