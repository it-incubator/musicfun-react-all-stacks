import { useState } from 'react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  ImageUploader,
  TagEditor,
  Textarea,
  TextField,
  Typography,
} from '@/shared/components'

import s from './CreatePlaylistModal.module.css'

export const CreatePlaylistModal = ({ onClose }: { onClose: () => void }) => {
  const [tags, setTags] = useState<string[]>([])
  const handleTagsChange = (tags: string[]) => {
    setTags(tags)
  }

  return (
    <Dialog open onClose={onClose} className={s.dialog}>
      <DialogHeader>
        <Typography variant="h2">Create Playlist</Typography>
      </DialogHeader>

      <form className={s.form}>
        <DialogContent className={s.content}>
          <ImageUploader className={s.imageUploader} onImageSelect={() => {}} />
          <TextField label="Title" placeholder="Enter playlist title" />
          <Textarea rows={3} label="Description" placeholder="Enter playlist description" />
          <TagEditor label="Hashtags" value={tags} onTagsChange={handleTagsChange} maxTags={5} />
        </DialogContent>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
