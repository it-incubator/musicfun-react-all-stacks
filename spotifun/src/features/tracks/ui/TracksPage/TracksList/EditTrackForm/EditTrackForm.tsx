import { tagsKey } from "@/common/apiEntities"
import { tagsApi } from "@/features/tags/api/tagsApi.ts"
import { useQuery } from "@tanstack/react-query"
import { type Dispatch, type MouseEvent, type SetStateAction } from "react"
import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from "react-hook-form"
import type { UpdateTrackArgs } from "../../../../api/tracksApi.types.ts"
import s from "./EditTrackForm.module.css"

type Props = {
  editTrack: (e: MouseEvent) => void
  register: UseFormRegister<UpdateTrackArgs>
  handleSubmit: UseFormHandleSubmit<UpdateTrackArgs>
  onSubmit: SubmitHandler<UpdateTrackArgs>
  selectedTags: string[]
  setSelectedTags: Dispatch<SetStateAction<string[]>>
}

export const EditTrackForm = ({
  editTrack,
  register,
  handleSubmit,
  onSubmit,
  setSelectedTags,
  selectedTags,
}: Props) => {
  const { data } = useQuery({ queryKey: [tagsKey], queryFn: () => tagsApi.findTags("") })

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"item item--fullwidth"}>
      <h2>Редактировать трек</h2>

      {/* title */}
      <div>
        <h4 className={s.subTitle}>Описание трека</h4>
        <input {...register("title")} placeholder="Title" />
      </div>

      {/* lyrics */}
      <div>
        <h4 className={s.subTitle}>Лирика</h4>
        <input {...register("lyrics")} placeholder="Lyrics" />
      </div>

      {/* tags */}
      <div>
        <h4 className={s.subTitle}>Выбери тег из списка</h4>
        <div className={"tagsList"}>
          {data?.data.map((tag) => {
            const isSelected = selectedTags.includes(tag.id)
            return (
              <div
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`tagItem ${isSelected ? "selectedTag" : ""}`}
              >
                # {tag.name}
              </div>
            )
          })}
        </div>
      </div>
      <button type={"submit"}>Сохранить</button>
      <button type={"button"} onClick={editTrack}>
        Отмена
      </button>
    </form>
  )
}
