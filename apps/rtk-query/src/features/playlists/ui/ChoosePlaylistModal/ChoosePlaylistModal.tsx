import { useTranslation } from 'react-i18next'

import { useMeQuery } from '@/features/auth'
import { useFetchPlaylistsQuery } from '@/features/playlists'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Typography,
} from '@/shared/components'
import { ImageType } from '@/shared/types'
import { getImageByType } from '@/shared/utils'

import s from './ChoosePlaylistModal.module.css'

export const ChoosePlaylistModal = ({
  playlistIds,
  isOpen,
  setIsOpen,
  setPlaylistIds,
  onChoose,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  playlistIds: string[]
  setPlaylistIds: (playlistIds: string[]) => void
  onChoose?: () => void
}) => {
  const { t } = useTranslation()

  const { data: user } = useMeQuery()

  const { data: playlists } = useFetchPlaylistsQuery({
    userId: user?.userId,
  })

  function handleToggle(id: string) {
    if (playlistIds.includes(id)) {
      setPlaylistIds(playlistIds.filter((pid) => pid !== id))
    } else {
      setPlaylistIds([...playlistIds, id])
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-modal="true"
      aria-labelledby="choose-playlist-title">
      <DialogHeader>
        <Typography variant="h2">Choose playlist</Typography>
      </DialogHeader>
      <DialogContent>
        <ul className={s.playlistList}>
          {playlists?.data.map((playlist) => {
            const image = getImageByType(playlist.attributes.images, ImageType.MEDIUM)
            const checked = playlistIds.includes(playlist.id)
            return (
              <li key={playlist.id} className={s.playlistItem + (checked ? ' ' + s.selected : '')}>
                <label
                  className={s.playlistLabel}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      handleToggle(playlist.id)
                    }
                  }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggle(playlist.id)}
                    tabIndex={-1}
                    aria-checked={checked}
                    aria-label={`Select playlist ${playlist.attributes.title}`}
                  />
                  <div className={s.imageWrapper}>
                    <img src={image?.url || noCoverPlaceholder} alt={playlist.attributes.title} />
                  </div>
                  <Typography variant="h3" className={s.playlistTitle}>
                    {playlist.attributes.title}
                  </Typography>
                </label>
              </li>
            )
          })}
        </ul>
      </DialogContent>
      <DialogFooter>
        <Button variant="secondary" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setIsOpen(false)
            onChoose?.()
          }}
          disabled={playlistIds.length === 0}>
          {t('button.choose')}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
