import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { Profile } from '@/features/profile'
import { PROFILE_STORAGE_KEY } from '@/features/profile'
import {
  closeEditProfileModal,
  selectProfileAvatar,
  selectProfileFullName,
  setProfileAvatar,
  setProfileFullName,
} from '@/features/profile'
import { fileToBase64 } from '@/features/profile/utils'
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
import { showErrorToast } from '@/shared/utils'

import s from './EditProfileModal.module.css'

type FormData = {
  name: string
  surname: string
}

export const EditProfileModal = () => {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const profileFullName = useAppSelector(selectProfileFullName)
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      surname: '',
    },
  })

  // Initial values
  useEffect(() => {
    reset({
      name: profileFullName?.name,
      surname: profileFullName?.surname,
    })
  }, [profileFullName, reset])

  const handleClose = () => {
    dispatch(closeEditProfileModal())
  }

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
  }

  const onSubmit = async (data: FormData) => {
    try {
      const avatarBase64 = selectedImage ? await fileToBase64(selectedImage) : profileAvatarUrl
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
            placeholder="Upload Avatar"
          />

          <TextField
            {...register('name', {
              required: t('profile.title.required_name'),
              minLength: {
                value: 2,
                message: t('profile.title.min_value_name', { quantity: '2' }),
              },
              maxLength: {
                value: 20,
                message: t('profile.title.max_value_name', { quantity: '20' }),
              },
            })}
            label={t('profile.label.name')}
            placeholder={t('profile.placeholder.enter_profile_name')}
            errorMessage={errors.name?.message}
          />

          <TextField
            {...register('surname', {
              required: t('profile.title.required_surname'),
              minLength: {
                value: 2,
                message: t('profile.title.min_value_surname', { quantity: '2' }),
              },
              maxLength: {
                value: 20,
                message: t('profile.title.max_value_surname', { quantity: '20' }),
              },
            })}
            label={t('profile.label.surname')}
            placeholder={t('profile.placeholder.enter_profile_surname')}
            errorMessage={errors.surname?.message}
          />
        </DialogContent>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose} type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
