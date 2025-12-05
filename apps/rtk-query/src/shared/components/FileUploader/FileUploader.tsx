import { useState } from 'react'

import { AddTrackIcon, DeleteIcon } from '@/shared/icons'

import { IconButton } from '../IconButton'
import { Typography } from '../Typography'
import s from './FileUploader.module.css'

type FileUploaderProps = {
  onFileSelect: (file: File) => void
  accept?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  value?: File | null // controlled value (optional)
  onRemove?: () => void // optional remove handler
}

export const FileUploader = ({
  onFileSelect,
  accept = '.mp3,audio/*',
  placeholder = 'Choose Track',
  disabled = false,
  loading = false,
  value,
  onRemove,
}: FileUploaderProps) => {
  // Controlled/uncontrolled logic
  const [internalFile, setInternalFile] = useState<File | null>(null)
  const file = value !== undefined ? value : internalFile

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setInternalFile(file)
      onFileSelect(file)
    }
  }

  const handleRemove = () => {
    setInternalFile(null)
    onRemove?.()
  }

  // If file is selected, show only the file name block
  if (file) {
    return (
      <div className={s.container}>
        <div className={s.fileNameBox}>
          <AddTrackIcon className={s.icon} />
          <Typography variant="body2">{file.name}</Typography>
          {onRemove && (
            <IconButton
              type="button"
              className={s.removeBtn}
              onClick={handleRemove}
              disabled={loading || disabled}>
              <DeleteIcon width={20} height={20} />
            </IconButton>
          )}
        </div>
      </div>
    )
  }

  // If file is not selected, show the select button
  return (
    <div className={s.container}>
      <label className={s.uploadButton}>
        <AddTrackIcon className={s.icon} />
        <span>{placeholder}</span>
        <input
          type="file"
          accept={accept}
          className={s.input}
          onChange={handleFileChange}
          disabled={disabled || loading}
          tabIndex={-1}
        />
      </label>
    </div>
  )
}
