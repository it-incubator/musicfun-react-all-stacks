import { clsx } from 'clsx'
import { useState } from 'react'
import type { Area } from 'react-easy-crop'
import Cropper from 'react-easy-crop'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogFooter } from '../Dialog'
import { Typography } from '../Typography'
import s from './ImageCropper.module.css'

export type CropShape = 'rect' | 'round'

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
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropAreaChange = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<File> => {
    const image = new Image()
    image.src = imageSrc

    return new Promise((resolve, reject) => {
      image.onload = () => {
        // Create a canvas element to crop the image

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('No 2d context'))
          return
        }

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        // draw the cropped image on the canvas
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        )

        // convert the canvas to a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'))
              return
            }

            // create a file from the blob
            const file = new File([blob], originalFileName, {
              type: 'image/jpeg',
            })

            resolve(file)
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
    if (!croppedAreaPixels) {
      return
    }

    setIsProcessing(true)

    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(croppedFile, croppedAreaPixels)
      handleReset()
    } catch (error) {
      console.error('Error cropping image:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    handleReset()
    onClose()
  }

  const handleReset = () => {
    setCrop({
      x: 0,
      y: 0,
    })
    setZoom(1)
    setCroppedAreaPixels(null)
    setIsProcessing(false)
  }

  // Reset state when dialog opens/closes
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
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape={cropShape}
              onCropChange={setCrop}
              onCropComplete={onCropAreaChange}
              onZoomChange={setZoom}
              showGrid={cropShape === 'rect'}
            />
          )}
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
        <Button
          variant="primary"
          onClick={handleCropConfirm}
          disabled={!croppedAreaPixels || isProcessing}>
          {isProcessing ? 'Processing...' : 'Apply Crop'}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
