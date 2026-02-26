import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useMeQuery } from '@/features/auth/api/use-me.query'
import { useEditProfileSchema } from '@/features/profile/model/hooks'
import { useProfileStore } from '@/features/profile/model/profile-store'
import type { Profile } from '@/features/profile/types/profile.types'
import { profileStorage } from '@/features/profile/utils/profile-storage'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FormControlledTextField,
  ImageUploader,
  Typography,
} from '@/shared/components'

import s from './EditProfileModal.module.css'

type FormData = {
  name: string
  surname: string
}

const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const EditProfileModal = () => {
  const { t } = useTranslation()
  const { editProfileValidation } = useEditProfileSchema()
  const { data: me } = useMeQuery()

  const setEditProfileModalOpen = useProfileStore((state) => state.setEditProfileModalOpen)
  const setProfileAvatar = useProfileStore((state) => state.setProfileAvatar)
  const setProfileFullName = useProfileStore((state) => state.setProfileFullName)
  const profileFullName = useProfileStore((state) => state.profile.fullName)
  const profileAvatarUrl = useProfileStore((state) => state.profile.avatar)

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    defaultValues: {
      name: profileFullName?.name || '',
      surname: profileFullName?.surname || '',
    },
    mode: 'onChange',
  })

  const handleClose = () => {
    setEditProfileModalOpen(false)
  }

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
  }

  const onSubmit = async (data: FormData) => {
    if (!me?.userId) {
      toast('Failed to save profile', { type: 'error', theme: 'colored' })
      return
    }

    try {
      const avatarBase64 = selectedImage
        ? await convertFileToBase64(selectedImage)
        : profileAvatarUrl
      const fullName = data

      const profile: Profile = {
        fullName,
        avatar: avatarBase64 || null,
      }

      profileStorage.saveProfile(me.userId, profile)
      setProfileAvatar(profile.avatar)
      setProfileFullName(fullName)

      handleClose()
    } catch {
      toast('Failed to save profile', { type: 'error', theme: 'colored' })
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

          <FormControlledTextField
            control={control}
            name="name"
            rules={{ validate: editProfileValidation.validateName }}
            label={t('profile.label.name')}
            placeholder={t('profile.placeholder.enter_profile_name')}
          />

          <FormControlledTextField
            control={control}
            name="surname"
            rules={{ validate: editProfileValidation.validateSurname }}
            label={t('profile.label.surname')}
            placeholder={t('profile.placeholder.enter_profile_surname')}
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
