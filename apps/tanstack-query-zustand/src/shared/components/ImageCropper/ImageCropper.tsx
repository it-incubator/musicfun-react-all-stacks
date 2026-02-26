import { clsx } from 'clsx'
import { useState } from 'react'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogFooter } from '../Dialog'
import { Typography } from '../Typography'
import s from './ImageCropper.module.css'

export type CropShape = 'rect' | 'round'
export type Area = {
  width: number
  height: number
  x: number
  y: number
}

export type ImageCropperProps = {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedFile: File, croppedArea: Area) => void
  imageSrc: string
  originalFileName?: string
  cropShape?: CropShape
  className?: string
}

export const ImageCropper = ({
  isOpen,
  onClose,
  onCropComplete,
  imageSrc,
  originalFileName = 'cropped-image.jpg',
  cropShape = 'rect',
  className,
}: ImageCropperProps) => {
  const [focusX, setFocusX] = useState(50)
  const [focusY, setFocusY] = useState(50)
  const [zoom, setZoom] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const cropSize = 300

  const getCroppedImg = async (source: string): Promise<{ file: File; area: Area }> => {
    const image = new Image()
    image.src = source

    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('No 2d context'))
          return
        }

        canvas.width = cropSize
        canvas.height = cropSize

        const baseScale = Math.max(cropSize / image.naturalWidth, cropSize / image.naturalHeight)
        const scaledWidth = image.naturalWidth * baseScale * zoom
        const scaledHeight = image.naturalHeight * baseScale * zoom

        const focusXPx = (focusX / 100) * scaledWidth
        const focusYPx = (focusY / 100) * scaledHeight

        const maxLeft = Math.max(0, scaledWidth - cropSize)
        const maxTop = Math.max(0, scaledHeight - cropSize)

        const windowLeft = Math.min(Math.max(focusXPx - cropSize / 2, 0), maxLeft)
        const windowTop = Math.min(Math.max(focusYPx - cropSize / 2, 0), maxTop)

        const sourceX = windowLeft / (baseScale * zoom)
        const sourceY = windowTop / (baseScale * zoom)
        const sourceWidth = cropSize / (baseScale * zoom)
        const sourceHeight = cropSize / (baseScale * zoom)

        ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, cropSize, cropSize)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'))
              return
            }

            const file = new File([blob], originalFileName, { type: 'image/jpeg' })
            resolve({
              file,
              area: {
                x: Math.round(sourceX),
                y: Math.round(sourceY),
                width: Math.round(sourceWidth),
                height: Math.round(sourceHeight),
              },
            })
          },
          'image/jpeg',
          0.9
        )
      }

      image.onerror = () => {
        reject(new Error('Failed to load image'))
      }
    })
  }

  const handleCropConfirm = async () => {
    setIsProcessing(true)
    try {
      const { file, area } = await getCroppedImg(imageSrc)
      onCropComplete(file, area)
      handleReset()
    } catch (error) {
      console.error('Error cropping image:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFocusX(50)
    setFocusY(50)
    setZoom(1)
    setIsProcessing(false)
  }

  const handleCancel = () => {
    handleReset()
    onClose()
  }

  const handleClose = () => {
    if (!isProcessing) {
      handleCancel()
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className={clsx(s.dialog, className)}>
      <DialogContent className={s.dialogContent}>
        <div className={s.cropperContainer}>
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Crop preview"
              className={clsx(s.previewImage, cropShape === 'round' && s.round)}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: `${focusX}% ${focusY}%`,
              }}
            />
          )}
        </div>

        <div className={s.zoomControls}>
          <div className={s.zoomLabel}>
            <Typography variant="body2">Focus X</Typography>
            <Typography variant="body2" className={s.zoomValue}>
              {Math.round(focusX)}%
            </Typography>
          </div>
          <input
            type="range"
            value={focusX}
            min={0}
            max={100}
            step={1}
            onChange={(e) => setFocusX(Number(e.target.value))}
            className={s.zoomSlider}
            disabled={isProcessing}
          />
        </div>

        <div className={s.zoomControls}>
          <div className={s.zoomLabel}>
            <Typography variant="body2">Focus Y</Typography>
            <Typography variant="body2" className={s.zoomValue}>
              {Math.round(focusY)}%
            </Typography>
          </div>
          <input
            type="range"
            value={focusY}
            min={0}
            max={100}
            step={1}
            onChange={(e) => setFocusY(Number(e.target.value))}
            className={s.zoomSlider}
            disabled={isProcessing}
          />
        </div>

        <div className={s.zoomControls}>
          <div className={s.zoomLabel}>
            <Typography variant="body2">Zoom</Typography>
            <Typography variant="body2" className={s.zoomValue}>
              {Math.round(zoom * 100)}%
            </Typography>
          </div>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.05}
            onChange={(e) => setZoom(Number(e.target.value))}
            className={s.zoomSlider}
            disabled={isProcessing}
          />
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="secondary" onClick={handleCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCropConfirm} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Apply Crop'}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
