import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const { mutate } = useCreateTrack()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { mutate: mutateUploadCover } = useUploadTrackCover()

  const { register, handleSubmit, reset } = useForm<UploadTrackData>()

  const onSubmit: SubmitHandler<UploadTrackData> = (data) => {
    if (!data.file || data.file.length === 0) {
      toast(t('tracks.error.need_select_file'), {
        type: 'error',
        theme: 'colored',
      })
      return
    }

    const file = data.file[0]
    const maxSize = 1024 * 1024
    const allowedExtensions = ['.mp3', '.MP3']
    const fileExtension = file!.name.toLowerCase().slice(file!.name.lastIndexOf('.'))

    if (!allowedExtensions.includes(fileExtension)) {
      toast(t('tracks.error.incorrect_audio_format'), {
        type: 'error',
        theme: 'colored',
      })
      return
    }

    if (file!.size > maxSize) {
      toast(t('tracks.error.file_too_large', { size: Math.round(maxSize / (1024 * 1024)) }), {
        type: 'error',
        theme: 'colored',
      })
      return
    }

    mutate(
      {
        title: data.title,
        file: file!,
      },
      {
        onSuccess: (response) => {
          const trackId = response.id

          if (selectedFile && trackId) {
            mutateUploadCover(
              {
                trackId,
                cover: selectedFile,
              },
              {
                onSuccess: () => {
                  onClose()
                  toast(t('tracks.success.upload_cover'), {
                    type: 'success',
                    theme: 'colored',
                  })
                  setSelectedFile(null)
                },
                onError: () => {
                  onClose()
                  toast(t('tracks.error.upload_cover'), {
                    type: 'error',
                    theme: 'colored',
                  })
                  setSelectedFile(null)
                },
              }
            )
          }

          toast(t('tracks.success.uploaded_successfully'), {
            type: 'success',
            theme: 'colored',
          })
          onClose()
          reset()
        },
      }
    )
  }

  const handleImageSelect = (fileCover: File) => {
    if (fileCover.size > 100 * 1024) {
      return
    }
    setSelectedFile(fileCover)
  }

  return (
    <Dialog open onClose={onClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">{t('tracks.title.create')}</Typography>
      </DialogHeader>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={s.content}>
          <TextField
            type={'file'}
            label={t('tracks.label.audio')}
            placeholder={t('tracks.button.upload')}
            {...register('file')}
          />
          <ImageUploader
            className={s.imageUploader}
            onImageSelect={handleImageSelect}
            maxSizeInMB={0.1}
          />
          <TextField
            label={t('title.title')}
            placeholder={t('tracks.placeholder.title')}
            {...register('title', { required: true })}
          />
          <Textarea
            rows={3}
            label={t('tracks.label.lyrics')}
            placeholder={t('tracks.placeholder.lyrics')}
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
