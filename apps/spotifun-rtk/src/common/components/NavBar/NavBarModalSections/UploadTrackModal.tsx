import { Modal } from "../../../../../../../../apihub-front/apps/spotifun-rtk/src/common/components"

type Props = {
  open: boolean
  onClose: () => void
}
export const UploadTrackModal = ({ open, onClose }: Props) => {
  return (
    <Modal modalTitle="Upload Track" open={open} onClose={onClose}>
      <div>Upload Track</div>
    </Modal>
  )
}
