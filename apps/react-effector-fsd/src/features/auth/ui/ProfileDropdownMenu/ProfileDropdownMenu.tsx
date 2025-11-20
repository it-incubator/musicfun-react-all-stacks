import { Link } from 'react-router'
import { useUnit } from 'effector-react'

import { $me, logoutFx } from '@/features/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
} from '@/shared/components'
import { LogoutIcon, ProfileIcon } from '@/shared/icons'

import s from './ProfileDropdownMenu.module.css'

export const ProfileDropdownMenu = ({ avatar }: { avatar: string }) => {
  const [me, logout, logoutPending] = useUnit([$me, logoutFx, logoutFx.pending])

  const handleLogout = () => {
    logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={s.trigger}>
        <div className={s.avatar}>
          <img src={avatar} alt={''} />
        </div>
        <Typography className={s.name} variant="body2">
          {me?.login ?? 'anonymous'}
        </Typography>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem as={Link} to={`/user/${me!.userId}`}>
          <ProfileIcon />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={logoutPending}>
          <LogoutIcon />
          <span>{logoutPending ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
