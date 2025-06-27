import { Modal } from "@/common/components"

type Props = {
  open: boolean
  onClose: () => void
}

export const CreatePlaylistModal = ({ open, onClose }: Props) => {
  return (
    <Modal modalTitle="Create Playlist" open={open} onClose={onClose}>
      <div>Create Playlist</div>
    </Modal>
  )
}
