import { type ChangeEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import type { Nullable } from "@/common"
import { queryClient } from "@/main.tsx"
import { TrackQueryKey, tracksApi } from "../../../api/tracksApi.ts"

export const AddTrackForm = () => {
  const [file, setFile] = useState<Nullable<File>>(null)

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<{ title: string }>({ mode: "onChange" })

  console.log("AddTrackForm")

  const { mutate, isPending } = useMutation({
    mutationFn: tracksApi.createTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      toast("Трек успешно загружен", { type: "success", theme: "colored" })
    },
    onError: () => {
      toast("Ошибка загрузки трека", { type: "error", theme: "colored" })
    },
  })

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      toast("Неверный формат", { theme: "colored", type: "error" })
      return
    }

    if (file.size > 1024 * 1024) {
      toast("Файл слишком большой (макс. 1 МБ).", { theme: "colored", type: "error" })
      return
    }

    setFile(file)
  }

  const onSubmit: SubmitHandler<{ title: string }> = ({ title }) => {
    if (!file) return

    // TODO: Можно ли загрузить трек не указывая плейлист?
    const playlistId = "fc815b2c-3ebe-4f8c-aae7-e54652dfea1f"
    mutate({ playlistId, title, file })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Добавить новый трек</h2>
      <div>
        <input {...register("title")} placeholder="Введите название трека" />
      </div>
      <div>
        <input type="file" accept="audio/*" onChange={uploadHandler} />
      </div>
      <button type="submit" disabled={isPending || !isValid || !file}>
        {isPending ? "Загрузка..." : "Добавить трек"}
      </button>
    </form>
  )
}
