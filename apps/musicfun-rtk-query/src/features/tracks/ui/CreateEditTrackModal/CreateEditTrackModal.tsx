import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { ArtistsTagAutocomplete } from '@/features/artists/ui'
import { ChoosePlaylistButtonAndModal } from '@/features/playlists/ui/ChoosePlaylistButtonAndModal'
import { PlaylistTagAutocomplete } from '@/features/tags/ui/PlaylistTagAutocomplete/PlaylistTagAutocomplete'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  FileUploader,
  ImageUploader,
  Textarea,
  TextField,
} from '@/shared/components'
import { Typography } from '@/shared/components/Typography/Typography'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

import {
  useAddCoverToTrackMutation,
  useAddTrackToPlaylistMutation,
  useCreateTrackMutation,
  useFetchTrackByIdQuery,
  usePublishTrackMutation,
  useUpdateTrackMutation,
} from '../../api/tracksApi'
import { closeCreateEditTrackModal, selectEditingTrackId } from '../../model/tracks-slice'
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
 * - Добавляем трек в каждый из выбранных плейлистов
 * - Обновляем данные по треку (заголовок, теги, текс)
 * - Публикуем трек
 */

type FormData = {
  title: string
  lyrics: string
  playlistIds: string[]
  tagIds: string[]
  artistsIds: string[]
  releaseDate: string
}

export const CreateEditTrackModal = () => {
  const dispatch = useAppDispatch()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [trackId, setTrackId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [createTrack] = useCreateTrackMutation()
  const [updateTrack] = useUpdateTrackMutation()
  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
  const [addCoverToTrack] = useAddCoverToTrackMutation()
  const [publishTrack] = usePublishTrackMutation()

  const editingTrackId = useAppSelector(selectEditingTrackId)
  console.log('editingTrackId', editingTrackId)

  const isEditMode = Boolean(editingTrackId)

  const { data: trackData } = useFetchTrackByIdQuery(
    { trackId: editingTrackId! },
    {
      skip: !editingTrackId,
    }
  )

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
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
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      lyrics: '',
      playlistIds: [],
      tagIds: [],
      artistsIds: [],
      releaseDate: new Date().toISOString(),
    },
  })

  // Initial values
  useEffect(() => {
    if (isEditMode && trackData?.data) {
      const track = trackData.data.attributes
      reset({
        title: track.title,
        lyrics: track.lyrics || '',
        tagIds: track.tags.map((tag) => tag.id),
        artistsIds: track.artists.map((artist) => artist.id),
      })
    }
  }, [isEditMode, trackData, reset])

  const onSubmit = (data: FormData) => {
    if (!trackId) return
    updateTrack({ trackId, payload: data })
      .unwrap()
      .then(() => {
        dispatch(closeCreateEditTrackModal())
      })

    for (const playlistId of data.playlistIds) {
      addTrackToPlaylist({ trackId, playlistId })
    }

    if (selectedImage) {
      addCoverToTrack({ trackId, cover: selectedImage })
    }

    publishTrack({ trackId })

    dispatch(closeCreateEditTrackModal())
  }

  return (
    <Dialog open={true} onClose={handleClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">Create Track</Typography>
      </DialogHeader>
      <DialogContent className={s.content}>
        {!isEditMode && (
          <>
            <FileUploader onFileSelect={handleFileSelect} />
            <Button onClick={handleUpload}>Upload</Button>
          </>
        )}

        <div>
          <ImageUploader onImageSelect={handleImageSelect} className={s.imageUploader} />

          <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Title"
              placeholder="Enter track title"
              {...register('title')}
              errorMessage={errors.title?.message}
            />

            <Controller
              control={control}
              name="artistsIds"
              render={({ field }) => (
                <ArtistsTagAutocomplete value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              control={control}
              name="tagIds"
              render={({ field }) => (
                <PlaylistTagAutocomplete value={field.value} onChange={field.onChange} />
              )}
            />

            <Textarea
              label="Lyrics"
              placeholder="Enter track lyrics"
              {...register('lyrics')}
              errorMessage={errors.lyrics?.message}
            />

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

            <div className={s.buttonsRow}>
              <Button variant="secondary" onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={!trackId && !isEditMode}>
                {isEditMode ? 'Save' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
