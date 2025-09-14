import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import {
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
  name,
  id,
}: {
  avatar: string
  name: string
  id: string
}) => {
  const { t } = useTranslation()

  const [logout] = useLogoutMutation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={s.trigger}>
        <div className={s.avatar}>
          <img src={avatar} alt={''} />
        </div>

        <Typography className={s.name} variant="body2">
          {name}
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
