import { clsx } from 'clsx'
import type { ComponentProps, KeyboardEvent } from 'react'
import { useState } from 'react'

import { DeleteIcon } from '@/shared/icons'

import { IconButton } from '../IconButton'
import { TextField } from '../TextField'
import { Typography } from '../Typography'
import s from './TagEditor.module.css'

export type TagEditorProps = {
  label?: string
  placeholder?: string
  value: string[]
  onTagsChange: (tags: string[]) => void
  maxTags?: number
  disabled?: boolean
} & ComponentProps<'div'>

export const TagEditor = ({
  label,
  placeholder = 'Add tag and press Enter',
  value,
  onTagsChange,
  className,
  maxTags,
  disabled = false,
  ...props
}: TagEditorProps) => {
  const [inputValue, setInputValue] = useState('')

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()

    if (!trimmedTag) return
    if (value.includes(trimmedTag)) return
    if (maxTags && value.length >= maxTags) return

    onTagsChange([...value, trimmedTag])
    setInputValue('')
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(value.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    }

    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const isMaxTagsReached = maxTags ? value.length >= maxTags : false

  return (
    <div className={clsx(s.container, className)} {...props}>
      <TextField
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isMaxTagsReached ? 'Max tags reached' : placeholder}
        disabled={disabled}
      />

      {value.length > 0 && (
        <ul className={s.tagsContainer}>
          {value.map((tag) => (
            <li key={tag} className={s.tag}>
              <Typography variant="body2" className={s.tagText}>
                {tag}
              </Typography>
              <IconButton
                onClick={() => removeTag(tag)}
                className={s.deleteButton}
                disabled={disabled}
                aria-label={`Remove tag ${tag}`}
                type="button"
              >
                <DeleteIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      {maxTags && (
        <Typography variant="caption" className={s.counter}>
          {value.length}/{maxTags} tags
        </Typography>
      )}
    </div>
  )
}
