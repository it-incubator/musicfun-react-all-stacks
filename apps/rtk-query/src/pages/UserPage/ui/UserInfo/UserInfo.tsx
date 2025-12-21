import { useTranslation } from 'react-i18next'

import { selectProfileAvatar, selectProfileFullName, useEditProfileModal } from '@/features/profile'
import { useOwnerData } from '@/pages/UserPage/hooks'
import { Avatar, Button, Typography } from '@/shared/components'
import { useAppSelector } from '@/shared/hooks'
import { EditIcon } from '@/shared/icons'

import s from './UserInfo.module.css'

export const UserInfo = () => {
  const { t } = useTranslation()

  const { isProfileOwner, userLogin } = useOwnerData()

  const { handleOpenEditProfileModal } = useEditProfileModal()
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)
  const profileFullName = useAppSelector(selectProfileFullName)

  const userFullName =
    isProfileOwner && profileFullName.name
      ? `${profileFullName.name} ${profileFullName.surname}`
      : userLogin

  return (
    <div className={s.box}>
      <Avatar
        src={profileAvatarUrl}
        fullName={isProfileOwner ? profileFullName : undefined}
        userLogin={userLogin}
      />
      <Typography variant="h2">{userFullName}</Typography>
      {isProfileOwner && (
        <Button className={s.editButton} variant="secondary" onClick={handleOpenEditProfileModal}>
          <EditIcon />
          {t('button.edit_profile')}
        </Button>
      )}

      {/* TODO: Backend don't return this data 😢 */}

      {/* <dl className={s.descriptionList}>
        <div className={s.descriptionItem}>
          <Typography as="dd" variant="body1">
            58
          </Typography>
          <Typography as="dt" variant="body2">
            Playlists
          </Typography>
        </div>
        <div className={s.descriptionItem}>
          <Typography as="dd" variant="body1">
            100
          </Typography>
          <Typography as="dt" variant="body2">
            Tracks
          </Typography>
        </div>
      </dl> */}
    </div>
  )
}
