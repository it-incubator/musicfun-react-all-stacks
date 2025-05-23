import { type Nullable, showErrorToast, showSuccessToast } from "@/common"
import { queryClient } from "@/main.tsx"
import { useMutation, useQuery } from "@tanstack/react-query"
import { type ChangeEvent, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { PlaylistQueryKey, playlistsApi } from "../../../../playlists/api/playlistsApi.ts"
import { TrackQueryKey, tracksApi } from "../../../api/tracksApi.ts"

export const AddTrackForm = () => {
  const [file, setFile] = useState<Nullable<File>>(null)
  const [playlistId, setPlaylistId] = useState<Nullable<string>>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<{ title: string }>({ mode: "onChange" })

  const { mutate, isPending } = useMutation({
    mutationFn: tracksApi.createTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      showSuccessToast("Трек успешно загружен")
      reset()
      setFile(null)
      setPlaylistId(null)
    },
    onError: (error) => {
      showErrorToast("Ошибка загрузки трека", error)
    },
  })

  const { data } = useQuery({
    queryKey: [PlaylistQueryKey, "my"],
    queryFn: playlistsApi.fetchMyPlaylists,
  })

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      showErrorToast("Неверный формат")
      return
    }

    if (file.size > 1024 * 1024) {
      showErrorToast("Файл слишком большой (макс. 1 МБ).")
      return
    }

    setFile(file)
  }

  const onSubmit: SubmitHandler<{ title: string }> = ({ title }) => {
    if (!playlistId || !file) return
    mutate({ playlistId, title, file })
  }

  const isSubmitDisabled = !playlistId || !file || !isValid || isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Добавить новый трек</h2>
      <div>
        <label>
          Введите название трека:
          <input {...register("title")} placeholder="Введите название трека" />
        </label>
      </div>
      <div>
        <label>
          Загрузите аудио файл:
          <input type="file" accept="audio/*" onChange={uploadHandler} />
        </label>
      </div>

      <div>
        <label>
          Выберите плейлист:
          <select onChange={(e) => setPlaylistId(e.target.value)} value={playlistId ?? ""}>
            <option value="" disabled>
              -- Выберите плейлист --
            </option>
            {data?.data.data.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.attributes.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" disabled={isSubmitDisabled}>
        {isPending ? "Загрузка..." : "Добавить трек"}
      </button>
    </form>
  )
}
