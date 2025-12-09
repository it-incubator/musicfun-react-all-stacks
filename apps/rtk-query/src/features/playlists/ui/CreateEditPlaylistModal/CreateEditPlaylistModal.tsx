import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  useCreatePlaylistMutation,
  useFetchPlaylistByIdQuery,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists'
import { closeCreateEditModal, selectEditingPlaylistId } from '@/features/playlists'
import { PlaylistTagAutocomplete } from '@/features/tags/ui'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  ImageUploader,
  Textarea,
  TextField,
  Typography,
} from '@/shared/components'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { showErrorToast } from '@/shared/utils'

import s from './CreateEditPlaylistModal.module.css'

type FormData = {
  title: string
  description: string
  tags: string[]
}

export const CreateEditPlaylistModal = () => {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const editingPlaylistId = useAppSelector(selectEditingPlaylistId)

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const isEditMode = !!editingPlaylistId

  // Запрос данных плейлиста для редактирования
  const { data: playlistData } = useFetchPlaylistByIdQuery(editingPlaylistId!, {
    skip: !editingPlaylistId,
  })

  const playlistCoverUrl = playlistData?.data.attributes.images.main.find(
    (image) => image.type === 'original'
  )?.url

  const [createPlaylist] = useCreatePlaylistMutation()
  const [updatePlaylist] = useUpdatePlaylistMutation()
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    },
  })

  const tagsValue = watch('tags')

  // Initial values
  useEffect(() => {
    if (isEditMode && playlistData?.data) {
      const playlist = playlistData.data.attributes
      reset({
        title: playlist.title,
        description: playlist.description,
        tags: playlist.tags.map((tag) => tag.id),
      })
    }
  }, [isEditMode, playlistData, reset])

  const handleClose = () => {
    dispatch(closeCreateEditModal())
  }

  const handleTagsChange = (tags: string[]) => {
    setValue('tags', tags)
  }

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode) {
        await updatePlaylist({
          playlistId: editingPlaylistId,
          payload: {
            title: data.title,
            description: data.description,
            tagIds: data.tags,
          },
        }).unwrap()

        if (selectedImage) {
          await uploadPlaylistCover({
            playlistId: editingPlaylistId,
            file: selectedImage,
          })

          handleClose()
        } else {
          handleClose()
        }
      } else {
        const createResult = await createPlaylist({
          title: data.title,
          description: data.description,
        }).unwrap()

        const playlistId = createResult.data.id

        const updatePromise = updatePlaylist({
          playlistId: createResult.data.id,
          payload: {
            ...createResult.data.attributes,
            tagIds: data.tags,
          },
        }).unwrap()

        const uploadImagePromise = selectedImage
          ? uploadPlaylistCover({
              playlistId,
              file: selectedImage,
            }).unwrap()
          : Promise.resolve()

        await Promise.all([updatePromise, uploadImagePromise])

        handleClose()
      }
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} playlist:`, error)
      showErrorToast(`Failed to ${isEditMode ? 'update' : 'create'} playlist`)
    }
  }

  return (
    <Dialog open onClose={handleClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">
          {isEditMode ? t('playlists.title.edit_playlist') : t('playlists.title.create_playlist')}
        </Typography>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <DialogContent className={s.content}>
          <ImageUploader
            className={s.imageUploader}
            onImageSelect={handleImageSelect}
            initialImageUrl={isEditMode ? playlistCoverUrl : undefined}
          />

          <TextField
            {...register('title', {
              required: t('title.required'),
              minLength: {
                value: 2,
                message: t('title.min_value', { quantity: '2' }),
              },
              maxLength: {
                value: 100,
                message: t('title.max_value', { quantity: '100' }),
              },
            })}
            label={t('title.title')}
            placeholder={t('playlists.placeholder.enter_playlist_title')}
            errorMessage={errors.title?.message}
          />

          <Textarea
            {...register('description', {
              maxLength: {
                value: 500,
                message: t('description.title.max_value', { quantity: '500' }),
              },
            })}
            rows={3}
            label={t('description.label.description')}
            placeholder={t('playlists.placeholder.enter_playlist_description')}
            errorMessage={errors.description?.message}
          />

          <PlaylistTagAutocomplete value={tagsValue} onChange={handleTagsChange} />
        </DialogContent>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose} type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update'
                : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
