import { useState } from 'react'
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
import { showErrorToast } from '@/shared/utils'

import { useCreatePlaylistMutation, useUploadPlaylistCoverMutation } from '../../api/playlistsApi'
import s from './CreatePlaylistModal.module.css'

type FormData = {
  title: string
  description: string
  tags: string[]
}

type CreatePlaylistModalProps = {
  onClose: () => void
}

export const CreatePlaylistModal = ({ onClose }: CreatePlaylistModalProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [createPlaylist] = useCreatePlaylistMutation()
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    },
  })

  const tagsValue = watch('tags')

  const handleTagsChange = (tags: string[]) => {
    setValue('tags', tags)
  }

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
  }

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // Сначала создаем плейлист
      const createResult = await createPlaylist({
        title: data.title,
        description: data.description,
      }).unwrap()

      const playlistId = createResult.data.id

      // Если есть изображение, загружаем его
      if (selectedImage) {
        try {
          await uploadPlaylistCover({
            playlistId,
            file: selectedImage,
          }).unwrap()
        } catch (uploadError) {
          // Не блокируем создание плейлиста из-за ошибки загрузки изображения
          console.error('Failed to upload cover:', uploadError)
          showErrorToast('Playlist created, but failed to upload cover image')
        }
      }

      onClose()
    } catch (error) {
      console.error('Failed to create playlist:', error)
      showErrorToast('Failed to create playlist')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onClose={onClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">Create Playlist</Typography>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <DialogContent className={s.content}>
          <ImageUploader className={s.imageUploader} onImageSelect={handleImageSelect} />

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
          <Button variant="secondary" onClick={onClose} type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
