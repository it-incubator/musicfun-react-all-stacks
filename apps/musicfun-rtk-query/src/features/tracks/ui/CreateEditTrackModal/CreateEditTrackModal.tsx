import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ArtistsTagAutocomplete } from '@/features/artists/ui'
import { useFetchPlaylistsQuery } from '@/features/playlists'
import { ChoosePlaylistButtonAndModal } from '@/features/playlists/ui/ChoosePlaylistButtonAndModal'
import { PlaylistTagAutocomplete } from '@/features/tags/ui/PlaylistTagAutocomplete/PlaylistTagAutocomplete'
import {
  useAddCoverToTrackMutation,
  useAddTrackToPlaylistMutation,
  useCreateTrackMutation,
  useFetchTrackByIdQuery,
  usePublishTrackMutation,
  useRemoveTrackFromPlaylistMutation,
  useUpdateTrackMutation,
} from '@/features/tracks'
import { closeCreateEditTrackModal, selectEditingTrackId } from '@/features/tracks'
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
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { addTrackToPlaylists, syncTrackPlaylists } from '../../utils/playlistSync'
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
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [trackId, setTrackId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [createTrack] = useCreateTrackMutation()
  const [updateTrack] = useUpdateTrackMutation()
  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
  const [removeTrackFromPlaylist] = useRemoveTrackFromPlaylistMutation()
  const [addCoverToTrack] = useAddCoverToTrackMutation()
  const [publishTrack] = usePublishTrackMutation()

  const editingTrackId = useAppSelector(selectEditingTrackId)

  const isEditMode = Boolean(editingTrackId)

  const { data: trackData } = useFetchTrackByIdQuery(
    { trackId: editingTrackId! },
    {
      skip: !editingTrackId,
    }
  )

  const trackCoverUrl = getImageByType(
    trackData?.data.attributes.images || { main: [] },
    ImageType.ORIGINAL
  )?.url

  const { data: playlists } = useFetchPlaylistsQuery(
    {
      trackId: editingTrackId!,
    },
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
    if (!selectedFile) {
      return
    }
    createTrack({
      title: selectedFile.name,
      file: selectedFile,
    })
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
        playlistIds: playlists?.data.map((playlist) => playlist.id) || [],
        releaseDate: track.releaseDate || new Date().toISOString(),
      })
    }
  }, [isEditMode, trackData, reset, playlists])

  const onSubmit = async (data: FormData) => {
    if (!trackId && !isEditMode) {
      return
    }

    const trackIdToUpdate = trackId || editingTrackId!

    try {
      const promises: Promise<unknown>[] = []

      promises.push(
        updateTrack({
          trackId: trackIdToUpdate,
          payload: data,
        }).unwrap()
      )

      // Синхронизация плейлистов
      if (isEditMode && playlists?.data) {
        const originalPlaylistIds = playlists.data.map((playlist) => playlist.id)
        const newPlaylistIds = data.playlistIds

        promises.push(
          syncTrackPlaylists({
            originalPlaylistIds,
            newPlaylistIds,
            trackId: trackIdToUpdate,
            addTrackToPlaylist: (params) => addTrackToPlaylist(params).unwrap(),
            removeTrackFromPlaylist: (params) => removeTrackFromPlaylist(params).unwrap(),
          })
        )
      } else if (!isEditMode) {
        // Для нового трека просто добавляем во все выбранные плейлисты
        promises.push(
          addTrackToPlaylists(trackIdToUpdate, data.playlistIds, (params) =>
            addTrackToPlaylist(params).unwrap()
          )
        )
      }

      if (selectedImage) {
        promises.push(
          addCoverToTrack({
            trackId: trackIdToUpdate,
            cover: selectedImage,
          }).unwrap()
        )
      }

      if (!trackData?.data.attributes.releaseDate) {
        promises.push(publishTrack({ trackId: trackIdToUpdate }).unwrap())
      }

      await Promise.all(promises)
      dispatch(closeCreateEditTrackModal())
    } catch (error) {
      console.error('Error saving track:', error)
    }
  }

  return (
    <Dialog open={true} onClose={handleClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">
          {isEditMode ? t('tracks.title.edit') : t('tracks.title.create')}
        </Typography>
      </DialogHeader>
      <DialogContent className={s.content}>
        {!isEditMode && (
          <>
            <FileUploader onFileSelect={handleFileSelect} />
            <Button
              className={s.uploadButton}
              onClick={handleUpload}
              disabled={Boolean(trackId) || !selectedFile}>
              {t('tracks.button.upload')}
            </Button>
          </>
        )}

        {(trackId || isEditMode) && (
          <div>
            <ImageUploader
              onImageSelect={handleImageSelect}
              className={s.imageUploader}
              initialImageUrl={isEditMode ? trackCoverUrl : undefined}
            />

            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label={t('tracks.label.title')}
                placeholder={t('tracks.placeholder.title')}
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
                label={t('tracks.label.lyrics')}
                placeholder={t('tracks.placeholder.lyrics')}
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
                  {t('tracks.button.cancel')}
                </Button>
                <Button variant="primary" type="submit" disabled={!trackId && !isEditMode}>
                  {isEditMode ? t('tracks.button.save') : t('tracks.button.create')}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
