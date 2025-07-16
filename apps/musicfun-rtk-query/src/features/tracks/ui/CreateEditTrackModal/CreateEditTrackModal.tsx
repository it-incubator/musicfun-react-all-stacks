import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { ArtistsTagAutocomplete } from '@/features/artists/ui'
import { ChoosePlaylistButtonAndModal } from '@/features/playlists/ui/ChoosePlaylistButtonAndModal'
import { PlaylistTagAutocomplete } from '@/features/tags/ui/PlaylistTagAutocomplete/PlaylistTagAutocomplete'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FileUploader,
  ImageUploader,
  Textarea,
  TextField,
} from '@/shared/components'
import { Typography } from '@/shared/components/Typography/Typography'
import { useAppDispatch } from '@/shared/hooks'

import {
  useAddCoverToTrackMutation,
  useAddTrackToPlaylistMutation,
  useCreateTrackMutation,
  usePublishTrackMutation,
  useUpdateTrackMutation,
} from '../../api/tracksApi'
import { closeCreateEditTrackModal } from '../../model/tracks-slice'
import s from './CreateEditTrackModal.module.css'

/**
 * Создание трека:
 * 1. Выбор файла + кнопка отправить
 * 2. После отправки файла мы получаем id трека, и отображаем другие поля формы:
 * - ImageUploader
 * - Title
 * - плейлисты
 * - теги
 * - Lyrics
 * 3. При нажатии на кнопку сохранения, мы отправляем данные на сервер
 * - Загружаем изображение
 * - Добавляем трек в плейлисты (если выбрали плейлисты)
 * - Обновляем данные по плейлисты (заголовок, теги, текс)
 * - Публикуем трек
 */

type FormData = {
  title: string
  lyrics: string
  playlistIds: string[]
  tags: string[]
  artists: string[]
}

export const CreateEditTrackModal = () => {
  const dispatch = useAppDispatch()
  //const [playlistIds, setPlaylistIds] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [trackId, setTrackId] = useState<string | null>(null)

  const [createTrack] = useCreateTrackMutation()
  const [updateTrack] = useUpdateTrackMutation()
  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
  const [addCoverToTrack] = useAddCoverToTrackMutation()
  const [publishTrack] = usePublishTrackMutation()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleUpload = () => {
    if (!selectedFile) return
    createTrack({ title: selectedFile.name, file: selectedFile })
      .unwrap()
      .then((res) => {
        setTrackId(res?.data?.id)
      })
  }

  const handleClose = () => {
    dispatch(closeCreateEditTrackModal())
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      lyrics: '',
      playlistIds: [],
      tags: [],
      artists: [],
    },
  })

  console.log(errors)

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <Dialog open={true} onClose={handleClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">Create Track</Typography>
      </DialogHeader>
      <DialogContent className={s.content}>
        <FileUploader onFileSelect={handleFileSelect} />
        <Button onClick={handleUpload}>Upload</Button>

        <div>
          <ImageUploader onImageSelect={() => {}} className={s.imageUploader} />

          <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Title" placeholder="Enter track title" {...register('title')} />

            <Controller
              control={control}
              name="artists"
              render={({ field }) => (
                <ArtistsTagAutocomplete value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <PlaylistTagAutocomplete value={field.value} onChange={field.onChange} />
              )}
            />

            <Textarea label="Lyrics" placeholder="Enter track lyrics" {...register('lyrics')} />

            <Controller
              control={control}
              name="playlistIds"
              render={({ field }) => (
                <ChoosePlaylistButtonAndModal
                  playlistIds={field.value}
                  setPlaylistIds={field.onChange}
                />
              )}
            />

            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!trackId}>
              Create
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
