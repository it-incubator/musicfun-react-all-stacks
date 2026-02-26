import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { useLogoutMutation } from '@/features/auth/api/use-logout.mutation.ts'
import type { FullName } from '@/features/profile'
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
} from '@/shared/components'
import { LogoutIcon, ProfileIcon } from '@/shared/icons'

import s from './ProfileDropdownMenu.module.css'

type ProfileDropdownMenuProps = {
  avatar: string | null
  fullName: FullName
  userLogin: string
  id: string
}

export const ProfileDropdownMenu = ({
  avatar,
  fullName,
  userLogin,
  id,
}: ProfileDropdownMenuProps) => {
  const logoutMutation = useLogoutMutation()
  const { t } = useTranslation()
  const profileName = fullName?.name ? `${fullName.name} ${fullName.surname}` : userLogin

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={s.trigger}>
        <Avatar className={s.avatar} src={avatar} fullName={fullName} userLogin={userLogin} />
        <Typography className={s.name} variant="body2">
          {profileName}
        </Typography>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem as={Link} to={`/user/${id}`}>
          <ProfileIcon />
          <span>{t('auth.title.my_profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
          <LogoutIcon />
          <span>
            {logoutMutation.isPending ? t('auth.button.logging_out') : t('auth.title.logout')}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
