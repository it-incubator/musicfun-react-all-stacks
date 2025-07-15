import { useState } from 'react'

import { ChoosePlaylistButtonAndModal } from '@/features/playlists/ui/ChoosePlaylistButtonAndModal'
import { PlaylistTagAutocomplete } from '@/features/tags/ui/PlaylistTagAutocomplete/PlaylistTagAutocomplete'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FileUploader,
  ImageUploader,
  Textarea,
  TextField,
} from '@/shared/components'
import { Typography } from '@/shared/components/Typography/Typography'
import { useAppDispatch } from '@/shared/hooks'

import { closeCreateEditTrackModal } from '../../model/tracks-slice'
import s from './CreateEditTrackModal.module.css'

export const CreateEditTrackModal = () => {
  const dispatch = useAppDispatch()
  const [playlistIds, setPlaylistIds] = useState<string[]>([])

  const handleClose = () => {
    dispatch(closeCreateEditTrackModal())
  }

  return (
    <Dialog open={true} onClose={handleClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">Create Track</Typography>
      </DialogHeader>
      <DialogContent className={s.content}>
        <FileUploader onFileSelect={() => {}} />

        <div>
          <ImageUploader onImageSelect={() => {}} className={s.imageUploader} />

          <form className={s.form}>
            <TextField label="Title" placeholder="Enter track title" />

            <PlaylistTagAutocomplete value={[]} onChange={() => {}} />

            <Textarea label="Lyrics" placeholder="Enter track lyrics" />

            <ChoosePlaylistButtonAndModal
              playlistIds={playlistIds}
              setPlaylistIds={setPlaylistIds}
            />
          </form>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="secondary" onClick={handleClose} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
