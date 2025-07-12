import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  ImageUploader,
  TagEditor,
  Textarea,
  TextField,
  Typography,
} from '@/shared/components'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { showErrorToast } from '@/shared/utils'

import {
  useCreatePlaylistMutation,
  useFetchPlaylistByIdQuery,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
} from '../../api/playlistsApi'
import { closeCreateEditModal, selectEditingPlaylistId } from '../../model/playlists-slice'
import s from './CreateEditPlaylistModal.module.css'

type FormData = {
  title: string
  description: string
  tags: string[]
}

export const CreateEditPlaylistModal = () => {
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
        tags: playlist.tags.map((tag) => tag.name),
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
            // TODO: add update tags
          },
        }).unwrap()

        if (selectedImage) {
          uploadPlaylistCover({
            playlistId: editingPlaylistId,
            file: selectedImage,
          })
        }
      } else {
        const createResult = await createPlaylist({
          title: data.title,
          description: data.description,
        }).unwrap()

        const playlistId = createResult.data.id

        if (selectedImage) {
          uploadPlaylistCover({
            playlistId,
            file: selectedImage,
          })
        }
      }

      handleClose()
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} playlist:`, error)
      showErrorToast(`Failed to ${isEditMode ? 'update' : 'create'} playlist`)
    }
  }

  return (
    <Dialog open onClose={handleClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">{isEditMode ? 'Edit Playlist' : 'Create Playlist'}</Typography>
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
              required: 'Title is required',
              minLength: {
                value: 2,
                message: 'Title must be at least 2 characters',
              },
              maxLength: {
                value: 100,
                message: 'Title must be less than 100 characters',
              },
            })}
            label="Title"
            placeholder="Enter playlist title"
            errorMessage={errors.title?.message}
          />

          <Textarea
            {...register('description', {
              maxLength: {
                value: 500,
                message: 'Description must be less than 500 characters',
              },
            })}
            rows={3}
            label="Description"
            placeholder="Enter playlist description"
            errorMessage={errors.description?.message}
          />

          <TagEditor
            label="Hashtags"
            value={tagsValue}
            onTagsChange={handleTagsChange}
            maxTags={5}
          />
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
