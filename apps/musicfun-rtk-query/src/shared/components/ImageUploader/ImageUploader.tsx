import { clsx } from 'clsx'
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react'

import { ImageUploadIcon } from '@/shared/icons'

import { IconButton } from '../IconButton'
import { type CropShape, ImageCropper } from '../ImageCropper'
import { Typography } from '../Typography'
import s from './ImageUploader.module.css'

export type ImageUploaderProps = {
  onImageSelect: (file: File) => void
  className?: string
  acceptedFormats?: string[]
  placeholder?: string
  cropShape?: CropShape
  aspectRatio?: number
  enableCrop?: boolean
  cropTitle?: string
  cropDescription?: string
  initialImageUrl?: string
}

const MAX_SIZE_IN_MB = 5
const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const ImageUploader = ({
  className,
  onImageSelect,
  placeholder = 'Upload Cover Image',
  cropShape = 'rect',
  enableCrop = true,
  initialImageUrl,
}: ImageUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return `Only ${ACCEPTED_FORMATS.join(', ')} files are allowed`
    }

    const maxSizeInBytes = MAX_SIZE_IN_MB * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      return `File size must be less than ${MAX_SIZE_IN_MB}MB`
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)

    if (validationError) {
      setError(validationError)
      setPreview(null)
      return
    }

    setError(null)
    setOriginalFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setPreview(imageUrl)

      if (enableCrop) {
        setShowCropModal(true)
      } else {
        onImageSelect(file)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (croppedFile: File) => {
    // Create preview for cropped image
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(croppedFile)

    setShowCropModal(false)
    onImageSelect(croppedFile)
  }

  const handleCropCancel = () => {
    setShowCropModal(false)
    setPreview(null)
    setOriginalFile(null)
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith('image/'))

    if (imageFile) {
      handleFileSelect(imageFile)
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPreview(null)
    setOriginalFile(null)
    setError(null)
    // Clear input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className={clsx(s.container, className)}>
        <label
          className={clsx(
            s.dropZone,
            isDragOver && s.dragOver,
            preview && s.hasPreview,
            error && s.error
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FORMATS.join(',')}
            onChange={handleFileInputChange}
            className={s.hiddenInput}
            tabIndex={0}
          />

          {preview ? (
            <div className={s.previewContainer}>
              <img src={preview} alt="Preview" className={s.previewImage} />
              <IconButton
                className={s.removeButton}
                onClick={handleRemoveImage}
                aria-label="Remove image"
                type="button">
                ✕
              </IconButton>
            </div>
          ) : (
            <div className={s.uploadContent}>
              <div className={s.uploadIcon}>
                <ImageUploadIcon width={24} height={24} />
              </div>
              <Typography variant="body2" className={s.uploadText}>
                {placeholder}
              </Typography>
            </div>
          )}
        </label>

        {error && (
          <Typography variant="error" className={s.errorMessage}>
            {error}
          </Typography>
        )}
      </div>

      {/* Use the standalone ImageCropper component */}
      {enableCrop && preview && originalFile && (
        <ImageCropper
          isOpen={showCropModal}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
          imageSrc={preview}
          originalFileName={originalFile.name}
          cropShape={cropShape}
        />
      )}
    </>
  )
}
