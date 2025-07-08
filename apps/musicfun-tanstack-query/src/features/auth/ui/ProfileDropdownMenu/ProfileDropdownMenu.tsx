import { Link } from 'react-router'

import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
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
  const { data } = useMeQuery()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={s.trigger}>
        <div className={s.avatar}>
          <img src={avatar} alt={''} />
        </div>
        <Typography className={s.name} variant="body2">
          {data!.login}
        </Typography>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem as={Link} to={`/user/${data!.userId}`}>
          <ProfileIcon />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <LogoutIcon />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
