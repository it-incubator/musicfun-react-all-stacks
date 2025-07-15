import { useState } from 'react'

import { useMeQuery } from '@/features/auth'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  TextField,
  Typography,
} from '@/shared/components'
import { ImageType } from '@/shared/types'
import { getImageByType } from '@/shared/utils'

import { useFetchPlaylistsQuery } from '../../api/playlistsApi'
import s from './ChoosePlaylistButtonAndModal.module.css'

export const ChoosePlaylistButtonAndModal = ({
  playlistIds,
  setPlaylistIds,
}: {
  playlistIds: string[]
  setPlaylistIds: (playlistIds: string[]) => void
}) => {
  const { data: user } = useMeQuery()

  const [isOpen, setIsOpen] = useState(false)

  const { data: playlists } = useFetchPlaylistsQuery({
    userId: user?.userId,
  })

  const selectedPlaylists = playlists?.data.filter((p) => playlistIds.includes(p.id)) ?? []

  return (
    <>
      <div>
        <Typography variant="label" as="p">
          Choose playlist
        </Typography>
        <button type="button" className={s.chooseButton} onClick={() => setIsOpen(true)}>
          {playlistIds.length > 0 ? (
            <>
              <span className={s.selectedNames}>
                {selectedPlaylists.map((p) => p.attributes.title).join(', ')}
              </span>
            </>
          ) : (
            'Choose playlist'
          )}
        </button>
      </div>
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
                <li
                  key={playlist.id}
                  className={s.playlistItem + (checked ? ' ' + s.selected : '')}>
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
            onClick={() => setIsOpen(false)}
            disabled={playlistIds.length === 0}>
            Choose
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )

  function handleToggle(id: string) {
    if (playlistIds.includes(id)) {
      setPlaylistIds(playlistIds.filter((pid) => pid !== id))
    } else {
      setPlaylistIds([...playlistIds, id])
    }
  }
}
