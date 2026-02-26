import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { LoginModal } from '@/features/auth/ui/LoginModal'
import { CreatePlaylistModal } from '@/features/playlists'
import { CreateTrackModal } from '@/features/tracks/ui/CreateTrackForm/CreateTrackModal'
import { HomeIcon, LibraryIcon, PlaylistIcon, TrackIcon, UploadIcon } from '@/shared/icons'
import { CreateIcon } from '@/shared/icons/CreateIcon'

import { useUIStore } from '@/shared/model/ui-store'

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

export const MenuLinks = () => {
  const { data: user } = useMeQuery()
  const { t } = useTranslation()

  const {
    isCreatePlaylistModalOpen,
    isCreateTrackModalOpen,
    isAuthModalOpen,
    openCreatePlaylistModal,
    closeCreatePlaylistModal,
    openCreateTrackModal,
    closeCreateTrackModal,
    openAuthModal,
    closeAuthModal,
  } = useUIStore()

  const createLinks: MenuLink[] = useMemo(
    () => [
      {
        to: '/tracks',
        icon: <TrackIcon />,
        label: t('sidebar.all_tracks'),
      },
      {
        to: '/playlists',
        icon: <PlaylistIcon />,
        label: t('sidebar.all_playlists'),
      },
    ],
    [t]
  )

  const actionButtons: MenuButton[] = useMemo(
    () => [
      {
        // todo:task, implement upload track
        onClick: user ? () => openCreateTrackModal() : () => openAuthModal(),
        icon: <UploadIcon />,
        label: t('sidebar.upload_track'),
      },
      {
        // todo:task, implement upload playlist
        onClick: user ? () => openCreatePlaylistModal() : () => openAuthModal(),
        icon: <CreateIcon />,
        label: t('sidebar.create_playlist'),
      },
    ],
    [user, t, openCreateTrackModal, openCreatePlaylistModal, openAuthModal]
  )

  return (
    <>
      <nav className={s.column} aria-label="Main navigation">
        <ul className={s.list}>
          <li>
            <SidebarLink
              to={'/'}
              icon={<HomeIcon width={32} height={32} />}
              label={t('sidebar.home')}
            />
          </li>
          {user ? (
            <li>
              <SidebarLink
                to={`/user/${user.userId}`}
                icon={<LibraryIcon />}
                label={t('sidebar.your_library')}
              />
            </li>
          ) : (
            <li>
              <SidebarButton
                onClick={() => openAuthModal()}
                icon={<LibraryIcon />}
                label={t('sidebar.your_library')}
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
      {isCreatePlaylistModalOpen && <CreatePlaylistModal onClose={closeCreatePlaylistModal} />}
      {isCreateTrackModalOpen && <CreateTrackModal onClose={closeCreateTrackModal} />}
      {isAuthModalOpen && <LoginModal onClose={closeAuthModal} />}
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
