import { Avatar, Button, Typography } from '@/shared/components'
import { EditIcon } from '@/shared/icons'
import { useTranslation } from 'react-i18next'
import {
  selectProfileAvatar,
  selectProfileFullName,
  useEditProfileModal,
  useProfileStore,
} from '@/features/profile'
import { useUserPageData } from '../../hooks'
import { UserInfoSkeleton } from './UserInfoSkeleton'
import { UserStats } from './UserStats'

import s from './UserInfo.module.css'

export const UserInfo = () => {
  const { t } = useTranslation()
  const { isProfileOwner, userLogin, playlistsCount, tracksCount, isInitialLoading } =
    useUserPageData()
  const { handleOpenEditProfileModal } = useEditProfileModal()
  const profileAvatarUrl = useProfileStore(selectProfileAvatar)
  const profileFullName = useProfileStore(selectProfileFullName)

  const userFullName =
    isProfileOwner && profileFullName.name
      ? `${profileFullName.name} ${profileFullName.surname}`
      : userLogin

  if (isInitialLoading) {
    return <UserInfoSkeleton />
  }

  return (
    <div className={s.box}>
      <Avatar
        className={s.avatar}
        src={isProfileOwner ? profileAvatarUrl : undefined}
        fullName={isProfileOwner ? profileFullName : undefined}
        userLogin={userLogin}
      />
      <Typography variant="h2" className={s.userName}>
        {userFullName}
      </Typography>

      {isProfileOwner && (
        <Button className={s.editButton} variant="secondary" onClick={handleOpenEditProfileModal}>
          <EditIcon />
          {t('button.edit_profile')}
        </Button>
      )}
      <div className={s.stats}>
        <UserStats playlistsCount={playlistsCount} tracksCount={tracksCount} />
      </div>
    </div>
  )
}
