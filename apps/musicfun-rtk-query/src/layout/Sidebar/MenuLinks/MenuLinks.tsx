import clsx from 'clsx'
import { NavLink } from 'react-router'

import { useMeQuery } from '@/features/auth'
import { setIsAuthModalOpen } from '@/features/auth/model'
import { useCreatePlaylistModal } from '@/features/playlists'
import { useCreateTrackModal } from '@/features/tracks'
import { Paths } from '@/shared/configs'
import { useAppDispatch } from '@/shared/hooks'
import { HomeIcon, LibraryIcon, PlaylistIcon, TrackIcon, UploadIcon } from '@/shared/icons'
import { CreateIcon } from '@/shared/icons/CreateIcon'

import s from './MenuLinks.module.css'

type MenuLink = {
  to: string
  icon: React.ReactNode
  label: string
}

type MenuButton = {
  onClick: () => void
  icon: React.ReactNode
  label: string
}

const createLinks: MenuLink[] = [
  {
    to: Paths.Tracks,
    icon: <TrackIcon />,
    label: 'All Tracks',
  },
  {
    to: Paths.Playlists,
    icon: <PlaylistIcon />,
    label: 'All Playlists',
  },
]

export const MenuLinks = () => {
  const { data: user } = useMeQuery()
  const { handleOpenCreatePlaylistModal } = useCreatePlaylistModal()
  const { handleOpenCreateTrackModal } = useCreateTrackModal()
  const dispatch = useAppDispatch()
  const handleOpenAuthModal = () => {
    dispatch(setIsAuthModalOpen({ isAuthModalOpen: true }))
  }

  const actionButtons: MenuButton[] = [
    {
      onClick: user ? handleOpenCreateTrackModal : handleOpenAuthModal,
      icon: <UploadIcon />,
      label: 'Upload Track',
    },
    {
      onClick: user ? handleOpenCreatePlaylistModal : handleOpenAuthModal,
      icon: <CreateIcon />,
      label: 'Create Playlist',
    },
  ]

  return (
    <nav className={s.column} aria-label="Main navigation">
      <ul className={s.list}>
        <li>
          <SidebarLink to={Paths.Main} icon={<HomeIcon width={32} height={32} />} label="Home" />
        </li>
        {user ? (
          <li>
            <SidebarLink
              to={`${Paths.Profile}/${user?.userId}`}
              icon={<LibraryIcon />}
              label="Your Library"
            />
          </li>
        ) : (
          <li>
            <SidebarButton
              onClick={handleOpenAuthModal}
              icon={<LibraryIcon />}
              label="Your Library"
            />
          </li>
        )}
      </ul>
      <ul className={s.list}>
        {actionButtons.map((props) => (
          <li key={props.label}>
            <SidebarButton {...props} />
          </li>
        ))}
      </ul>
      <ul className={s.list}>
        {createLinks.map((props) => (
          <li key={props.to}>
            <SidebarLink {...props} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

const SidebarLink = ({ to, icon, label }: MenuLink) => (
  <NavLink to={to} className={({ isActive }) => clsx(s.link, isActive && s.active)}>
    {icon}
    {label}
  </NavLink>
)

const SidebarButton = ({ onClick, icon, label }: MenuButton) => (
  <button onClick={onClick} className={s.link} type="button">
    {icon}
    {label}
  </button>
)
