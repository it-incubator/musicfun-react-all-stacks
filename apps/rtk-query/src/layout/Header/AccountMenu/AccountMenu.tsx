import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { useLogoutMutation } from '@/features/auth'
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

import s from './AccountMenu.module.css'

type AccountMenuProps = {
  avatar: string | null
  fullName: FullName
  userLogin: string
  id: string
}

export const AccountMenu = ({ avatar, fullName, userLogin, id }: AccountMenuProps) => {
  const { t } = useTranslation()

  const [logout] = useLogoutMutation()

  const profileName = fullName?.name ? `${fullName.name} ${fullName.surname}` : userLogin

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={s.trigger}>
        <Avatar className={s.avatar} src={avatar} fullName={fullName} userLogin={userLogin} />

        <Typography className={s.name} variant="body2">
          {profileName}
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
