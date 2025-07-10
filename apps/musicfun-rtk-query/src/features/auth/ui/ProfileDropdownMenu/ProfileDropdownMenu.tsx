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
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()}>
          <LogoutIcon />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
