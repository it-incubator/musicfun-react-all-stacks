import { useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useUpdatePlaylistMutation } from '@/features/playlists/api/use-playlist-mutations'
import { usePlaylist } from '@/features/playlists/api/use-playlist.query'
import { useCreatePlaylist } from '@/pages/PlaylistsPage/model/useCreatePlaylist'
import { useUploadPlaylistCover } from '@/pages/PlaylistsPage/model/useUploadPlaylistCover'
import type { SchemaCreatePlaylistAttributes } from '@/shared/api/schema'
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
import { useUIStore } from '@/shared/model/ui-store'

import s from './CreatePlaylistModal.module.css'

export const CreatePlaylistModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()
  const { editingPlaylistId } = useUIStore()
  const isEditMode = !!editingPlaylistId

  const { mutate } = useCreatePlaylist()
  const { mutate: updatePlaylist } = useUpdatePlaylistMutation()
  const { data: playlistResponse } = usePlaylist(editingPlaylistId || '')
  const playlist = playlistResponse?.data
  const playlistCoverUrl = playlist?.attributes.images.main?.[0]?.url
  const { mutate: uploadPlaylistCover } = useUploadPlaylistCover()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const handleTagsChange = (tags: string[]) => {
    setTags(tags)
  }
  const { register, handleSubmit, reset } = useForm<SchemaCreatePlaylistAttributes>()

  useEffect(() => {
    if (!isEditMode || !playlist) {
      return
    }

    reset({
      title: playlist.attributes.title,
      description: playlist.attributes.description || '',
    })
    setTags(playlist.attributes.tags.map((tag) => tag.name))
  }, [isEditMode, playlist, reset])

  const onSubmit: SubmitHandler<SchemaCreatePlaylistAttributes> = (data) => {
    if (isEditMode) {
      if (!editingPlaylistId || !playlist) {
        return
      }

      const payload = {
        data: {
          type: 'playlists',
          attributes: {
            title: data.title,
            description: data.description || null,
            tagIds: playlist.attributes.tags.map((tag) => tag.id),
          },
        },
      } as const

      updatePlaylist(
        { playlistId: editingPlaylistId, payload },
        {
          onSuccess: () => {
            if (selectedFile) {
              uploadPlaylistCover(
                { playlistId: editingPlaylistId, file: selectedFile },
                {
                  onSettled: () => {
                    onClose()
                    reset()
                    setSelectedFile(null)
                  },
                }
              )
              return
            }
            onClose()
            reset()
          },
        }
      )
      return
    }

    const formData = {
      ...data,
      tags,
    }

    mutate(formData, {
      onSuccess: (response) => {
        const playlistId = response?.id

        if (selectedFile && playlistId) {
          uploadPlaylistCover(
            {
              playlistId,
              file: selectedFile,
            },
            {
              onSuccess: () => {
                onClose()
                toast('Success Upload', {
                  type: 'success',
                  theme: 'colored',
                })
                setSelectedFile(null)
                reset()
              },
              onError: () => {
                onClose()
                toast('Upload without image. Not correct size', {
                  type: 'warning',
                  theme: 'colored',
                })
                setSelectedFile(null)
                reset()
              },
            }
          )
        } else {
          onClose()
          reset()
          toast('Success Upload w/o image', {
            type: 'success',
            theme: 'colored',
          })
        }
      },
    })
  }

  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
  }

  return (
    <Dialog open onClose={onClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">
          {isEditMode ? t('button.edit') : t('playlists.title.create_playlist')}
        </Typography>
      </DialogHeader>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={s.content}>
          <ImageUploader
            className={s.imageUploader}
            onImageSelect={handleImageSelect}
            enableCrop
            cropShape="rect"
            initialImageUrl={isEditMode ? playlistCoverUrl : undefined}
          />
          <TextField
            label={t('title.title')}
            placeholder={t('playlists.placeholder.enter_playlist_title')}
            {...register('title', { required: true })}
          />
          <Textarea
            rows={3}
            label={t('description.label.description')}
            placeholder={t('playlists.placeholder.enter_playlist_description')}
            {...register('description', { required: true })}
          />
          <TagEditor
            label={t('tags.label')}
            value={tags}
            onTagsChange={handleTagsChange}
            maxTags={5}
          />
        </DialogContent>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} type="button">
            {t('button.cancel')}
          </Button>
          <Button variant="primary" type="submit">
            {t('button.create')}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
