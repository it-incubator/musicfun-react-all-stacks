import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { FullName } from '@/features/profile'
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
} from '@/shared/components'
import { Paths } from '@/shared/configs'
import { LogoutIcon, ProfileIcon } from '@/shared/icons'

import { useLogoutMutation } from '../../api'
import s from './ProfileDropdownMenu.module.css'

export const ProfileDropdownMenu = ({
  avatar,
  fullName,
  login,
  id,
}: {
  avatar: string | null
  fullName: FullName
  login: string
  id: string
}) => {
  const { t } = useTranslation()

  const [logout] = useLogoutMutation()

  const displayName = fullName?.name ? `${fullName.name} ${fullName.surname}` : login

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={s.trigger}>
        <Avatar className={s.avatar} src={avatar} fullName={fullName} login={login} />

        <Typography className={s.name} variant="body2">
          {displayName}
        </Typography>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem as={Link} to={`${Paths.Profile}/${id}`}>
          <ProfileIcon />
          <span>{t('auth.title.my_profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()}>
          <LogoutIcon />
          <span>{t('auth.title.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
