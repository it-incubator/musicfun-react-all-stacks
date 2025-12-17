import { useTranslation } from 'react-i18next'

import { setIsAuthModalOpen, useMeQuery } from '@/features/auth'
import { selectProfileAvatar, selectProfileFullName } from '@/features/profile'
import { useEditProfileModal } from '@/features/profile'
import { Avatar, Button, Typography } from '@/shared/components'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { EditIcon } from '@/shared/icons'

import s from './UserInfo.module.css'

export const UserInfo = () => {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const { data } = useMeQuery()

  const { handleOpenEditProfileModal } = useEditProfileModal()
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)
  const profileFullName = useAppSelector(selectProfileFullName)

  const handleOpenAuthModal = () => {
    dispatch(setIsAuthModalOpen({ isAuthModalOpen: true }))
  }

  const isAuth = !!data

  return (
    <div className={s.box}>
      <Avatar src={profileAvatarUrl} fullName={profileFullName} userLogin={data?.login} />
      <Typography variant="h2">
        {profileFullName?.name ? `${profileFullName.name} ${profileFullName.surname}` : data?.login}
      </Typography>
      <Button
        className={s.editButton}
        variant="secondary"
        onClick={isAuth ? handleOpenEditProfileModal : handleOpenAuthModal}>
        <EditIcon />
        {t('button.edit_profile')}
      </Button>

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
