import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { Profile } from '@/features/profile'
import {
  PROFILE_STORAGE_KEY,
  setEditProfileModalOpen,
  useEditProfileSchema,
} from '@/features/profile'
import {
  selectProfileAvatar,
  selectProfileFullName,
  setProfileAvatar,
  setProfileFullName,
} from '@/features/profile'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  ImageUploader,
  TextField,
  Typography,
} from '@/shared/components'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { convertFileToBase64, showErrorToast } from '@/shared/utils'

import s from './EditProfileModal.module.css'

type FormData = {
  name: string
  surname: string
}

export const EditProfileModal = () => {
  const { t } = useTranslation()
  const { editProfileSchema } = useEditProfileSchema()

  const dispatch = useAppDispatch()
  const profileFullName = useAppSelector(selectProfileFullName)
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profileFullName?.name || '',
      surname: profileFullName?.surname || '',
    },
    mode: 'onChange',
  })

  const handleClose = () => {
    dispatch(setEditProfileModalOpen(false))
  }

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
  }

  const onSubmit = async (data: FormData) => {
    try {
      const avatarBase64 = selectedImage
        ? await convertFileToBase64(selectedImage)
        : profileAvatarUrl
      const fullName = data

      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify({ fullName, avatar: avatarBase64 } as Profile)
      )

      dispatch(setProfileAvatar(avatarBase64))
      dispatch(setProfileFullName(fullName))

      handleClose()
    } catch (error) {
      console.error(`Failed to save profile:`, error)
      showErrorToast(`Failed to save profile`)
    }
  }

  return (
    <Dialog open onClose={handleClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">{t('profile.title.edit_profile')}</Typography>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <DialogContent className={s.content}>
          <ImageUploader
            className={s.imageUploader}
            onImageSelect={handleImageSelect}
            initialImageUrl={profileAvatarUrl || undefined}
            placeholder={t('profile.placeholder.upload_avatar')}
          />

          <TextField
            {...register('name')}
            label={t('profile.label.name')}
            placeholder={t('profile.placeholder.enter_profile_name')}
            errorMessage={errors.name?.message}
          />

          <TextField
            {...register('surname')}
            label={t('profile.label.surname')}
            placeholder={t('profile.placeholder.enter_profile_surname')}
            errorMessage={errors.surname?.message}
          />
        </DialogContent>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose} type="button" disabled={isSubmitting}>
            {t('button.cancel')}
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? t('button.saving') : t('button.save_changes')}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
