import { artistsKey, tagsKey } from "@/common/apiEntities"
import { artistsApi } from "@/features/artists/api/artistsApi.ts"
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
  tagIds: string[]
  setTagIds: Dispatch<SetStateAction<string[]>>
  artistsIds: string[]
  setArtistsIds: Dispatch<SetStateAction<string[]>>
}

export const EditTrackForm = ({
  editTrack,
  register,
  handleSubmit,
  onSubmit,
  tagIds,
  setTagIds,
  artistsIds,
  setArtistsIds,
}: Props) => {
  const { data: tagsResponse } = useQuery({ queryKey: [tagsKey], queryFn: () => tagsApi.findTags("") })
  const { data: artistsResponse } = useQuery({ queryKey: [artistsKey], queryFn: () => artistsApi.findArtists("") })

  const toggleTag = (tagId: string) => {
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const toggleArtist = (artistId: string) => {
    setArtistsIds((prev) => (prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId]))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`item item--fullwidth`}>
      <h2>Редактировать трек</h2>

      <div className={s.container}>
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
            {tagsResponse?.data.map((tag) => {
              const isSelected = tagIds.includes(tag.id)
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

        {/* Artists */}
        <div>
          <h4 className={s.subTitle}>Выбери артиста из списка</h4>
          <div className={"artistList"}>
            {artistsResponse?.data.map((artist) => {
              const isSelected = artistsIds.includes(artist.id)
              return (
                <div
                  key={artist.id}
                  onClick={() => toggleArtist(artist.id)}
                  className={`artistItem ${isSelected ? "selectedArtist" : ""}`}
                >
                  🎙️ {artist.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <button type={"submit"}>Сохранить</button>
      <button type={"button"} onClick={editTrack}>
        Отмена
      </button>
    </form>
  )
}
