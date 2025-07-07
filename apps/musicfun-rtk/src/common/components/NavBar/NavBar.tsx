import { type ReactNode, useState } from 'react'
import { NavLink } from 'react-router'
import { Path } from '@/common/routing'
import { CreatePlaylistModal } from '@/common/components/NavBar/NavBarModalSections/CreatePlaylistModal.tsx'
import { UploadTrackModal } from '@/common/components/NavBar/NavBarModalSections/UploadTrackModal.tsx'
import { CreateIcon, HomeIcon, LibraryIcon, NoteIcon, PlaylistIcon, UploadIcon } from '@/common/icons'
import s from './NavBar.module.css'

type Section = {
  links: Link[]
}
type Link = {
  to?: string
  label: string
  icon: ReactNode
  modalType?: ModalType
}
type ModalType = 'create' | 'upload' | null

const navSections: Section[] = [
  {
    links: [
      { to: Path.Main, label: 'Home', icon: <HomeIcon /> },
      { to: Path.Profile, label: 'Your Library', icon: <LibraryIcon /> },
    ],
  },
  {
    links: [
      { modalType: 'create', label: 'Create Playlist', icon: <CreateIcon /> },
      { modalType: 'upload', label: 'Upload Track', icon: <UploadIcon /> },
    ],
  },
  {
    links: [
      { to: Path.Tracks, label: 'All Tracks', icon: <NoteIcon /> },
      { to: Path.Playlists, label: 'All Playlists', icon: <PlaylistIcon /> },
    ],
  },
]

export const NavBar = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null)

  const openModalByType = (type: ModalType) => setOpenModal(type)
  const closeModal = () => setOpenModal(null)

  return (
    <>
      <nav className={s.navBar}>
        {navSections.map((section, sectionIndex) => (
          <div className={s.navSection} key={sectionIndex}>
            {section.links.map((link, linkIndex) =>
              link.to ? (
                <NavLink
                  key={linkIndex}
                  to={link.to}
                  className={({ isActive }) => `${s.link} ${isActive ? s.activeLink : ''}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ) : (
                <button key={linkIndex} className={s.link} onClick={() => openModalByType(link.modalType ?? null)}>
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ),
            )}
          </div>
        ))}
      </nav>

      {openModal === 'create' && <CreatePlaylistModal open onClose={closeModal} />}
      {openModal === 'upload' && <UploadTrackModal open onClose={closeModal} />}
    </>
  )
}
