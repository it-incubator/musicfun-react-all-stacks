import clsx from 'clsx'
import { useState } from 'react'
import { NavLink } from 'react-router'

import { CreatePlaylistModal } from '@/features/playlists'
import { CreateTrackModal } from '@/features/tracks/ui/CreateTrackForm/CreateTrackModal'
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

const mainLinks: MenuLink[] = [
  {
    to: '/',
    icon: <HomeIcon width={32} height={32} />,
    label: 'Home',
  },
  {
    to: '/user/1',
    icon: <LibraryIcon />,
    label: 'Your Library',
  },
]

const createLinks: MenuLink[] = [
  {
    to: '/tracks',
    icon: <TrackIcon />,
    label: 'All Tracks',
  },
  {
    to: '/playlists',
    icon: <PlaylistIcon />,
    label: 'All Playlists',
  },
]

export const MenuLinks = () => {
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false)
  const [isCreateTrackOpen, setIsCreateTrackOpen] = useState<boolean>(false)

  const actionButtons: MenuButton[] = [
    {
      // todo:task, implement upload track
      onClick: () => setIsCreateTrackOpen(true),
      icon: <UploadIcon />,
      label: 'Upload Track',
    },
    {
      // todo:task, implement upload playlist
      onClick: () => setIsCreatePlaylistOpen(true),
      icon: <CreateIcon />,
      label: 'Create Playlist',
    },
  ]

  return (
    <>
      <nav className={s.column} aria-label="Main navigation">
        <ul className={s.list}>
          {mainLinks.map((props) => (
            <li key={props.to}>
              <SidebarLink {...props} />
            </li>
          ))}
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
      {isCreatePlaylistOpen && (
        <CreatePlaylistModal onClose={() => setIsCreatePlaylistOpen(false)} />
      )}
      {isCreateTrackOpen && (
        <CreateTrackModal onClose={() => setIsCreateTrackOpen(false)} />
      )}
    </>
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
