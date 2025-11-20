import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import s from '@/features/playlists/ui/CreatePlaylistModal/CreatePlaylistModal.module.css'
import { useCreateTrack } from '@/pages/TracksPage/model/useUploadTrack'
import { useUploadTrackCover } from '@/pages/TracksPage/model/useUploadTrackCover'
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

type UploadTrackData = {
  title: string
  file: FileList
}

export const CreateTrackModal = ({ onClose }: { onClose: () => void }) => {
  const { mutate } = useCreateTrack()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { mutate: mutateUploadCover } = useUploadTrackCover()

  const { register, handleSubmit, reset } = useForm<UploadTrackData>()

  const onSubmit: SubmitHandler<UploadTrackData> = (data) => {
    if (!data.file || data.file.length === 0) {
      toast('Need select a file', { type: 'error', theme: 'colored' })
      return
    }

    const file = data.file[0]
    const maxSize = 1024 * 1024
    const allowedExtensions = ['.mp3', '.MP3']
    const fileExtension = file!.name.toLowerCase().slice(file!.name.lastIndexOf('.'))

    if (!allowedExtensions.includes(fileExtension)) {
      toast('Please select correct audio-format', { type: 'error', theme: 'colored' })
      return
    }

    if (file!.size > maxSize) {
      toast(`The file is too large. Max size is ${Math.round(maxSize / (1024 * 1024))} MB`, {
        type: 'error',
        theme: 'colored',
      })
      return
    }

    mutate(
      { title: data.title, file: file! },
      {
        onSuccess: (response) => {
          const trackId = response.id

          if (selectedFile && trackId) {
            mutateUploadCover(
              { trackId, cover: selectedFile },
              {
                onSuccess: () => {
                  onClose()
                  toast('Success Upload Cover', { type: 'success', theme: 'colored' })
                  setSelectedFile(null)
                },
                onError: () => {
                  onClose()
                  toast('Error upload cover', { type: 'success', theme: 'colored' })
                  setSelectedFile(null)
                },
              }
            )
          }

          toast('Track uploaded successfully', { type: 'success', theme: 'colored' })
          onClose()
          reset()
        },
      }
    )
  }

  const handleImageSelect = (fileCover: File) => {
    if (fileCover.size > 100 * 1024) return
    setSelectedFile(fileCover)
  }

  return (
    <Dialog open onClose={onClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">Create New Track</Typography>
      </DialogHeader>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={s.content}>
          <TextField type={'file'} label="Audlio" placeholder="Added track" {...register('file')} />
          <ImageUploader
            className={s.imageUploader}
            onImageSelect={handleImageSelect}
            maxSizeInMB={0.1}
          />
          <TextField
            label="Title"
            placeholder="Enter playlist title"
            {...register('title', { required: true })}
          />
          <Textarea rows={3} label="Lyrics" placeholder="Enter Lyrics description" />
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
