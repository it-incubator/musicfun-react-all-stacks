import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { useCreatePlaylist } from '@/pages/PlaylistsPage/model/useCreatePlaylist'
import { useUploadPlaylistCover } from '@/pages/PlaylistsPage/model/useUploadPlaylistCover'
import type { SchemaCreatePlaylistRequestPayload } from '@/shared/api/schema'
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

import s from './CreatePlaylistModal.module.css'

export const CreatePlaylistModal = ({ onClose }: { onClose: () => void }) => {
  const { mutate } = useCreatePlaylist()
  const { mutate: uploadPlaylistCover } = useUploadPlaylistCover()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const handleTagsChange = (tags: string[]) => {
    setTags(tags)
  }
  const { register, handleSubmit, reset } = useForm<SchemaCreatePlaylistRequestPayload>()

  const onSubmit: SubmitHandler<SchemaCreatePlaylistRequestPayload> = (data) => {
    const formData = {
      ...data,
      tags,
    }

    mutate(formData, {
      onSuccess: (response) => {
        const playlistId = response?.id

        if (selectedFile && playlistId) {
          uploadPlaylistCover(
            { playlistId, file: selectedFile },
            {
              onSuccess: () => {
                onClose()
                toast('Success Upload', { type: 'success', theme: 'colored' })
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
          toast('Success Upload w/o image', { type: 'success', theme: 'colored' })
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
        <Typography variant="h2">Create Playlist</Typography>
      </DialogHeader>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={s.content}>
          <ImageUploader className={s.imageUploader} onImageSelect={handleImageSelect} />
          <TextField
            label="Title"
            placeholder="Enter playlist title"
            {...register('title', { required: true })}
          />
          <Textarea
            rows={3}
            label="Description"
            placeholder="Enter playlist description"
            {...register('description', { required: true })}
          />
          <TagEditor label="Hashtags" value={tags} onTagsChange={handleTagsChange} maxTags={5} />
        </DialogContent>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
