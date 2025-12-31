import { useTranslation } from 'react-i18next'

import { selectProfileAvatar, selectProfileFullName, useEditProfileModal } from '@/features/profile'
import { useOwnerData } from '@/pages/UserPage/hooks'
import { UserStats } from './UserStats'
import { UserInfoSkeleton } from './UserInfoSkeleton'
import { Avatar, Button, Typography } from '@/shared/components'
import { useAppSelector } from '@/shared/hooks'
import { EditIcon } from '@/shared/icons'

import s from './UserInfo.module.css'

export const UserInfo = () => {
  const { t } = useTranslation()

  const { isProfileOwner, userLogin, playlists, tracks, isLoading } = useOwnerData()

  const { handleOpenEditProfileModal } = useEditProfileModal()
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)
  const profileFullName = useAppSelector(selectProfileFullName)

  const userFullName =
    isProfileOwner && profileFullName.name
      ? `${profileFullName.name} ${profileFullName.surname}`
      : userLogin

  if (isLoading) {
    return <UserInfoSkeleton />
  }

  return (
    <div className={s.box}>
      <Avatar
        src={isProfileOwner ? profileAvatarUrl : undefined}
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
      <UserStats
        playlistsCount={playlists?.meta.totalCount}
        tracksCount={tracks?.meta.totalCount}
      />
    </div>
  )
}
