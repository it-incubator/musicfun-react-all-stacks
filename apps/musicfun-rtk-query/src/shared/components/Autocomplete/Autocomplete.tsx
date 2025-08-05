import { clsx } from 'clsx'
import {
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { useGetId } from '@/shared/hooks'
import { ArrowDownIcon, DeleteIcon } from '@/shared/icons'

import { IconButton } from '../IconButton'
import { Typography } from '../Typography'
import s from './Autocomplete.module.css'

export type AutocompleteOption = {
  value: string
  label: string
  disabled?: boolean
}

export type AutocompleteProps = {
  label?: ReactNode
  placeholder?: string
  options: AutocompleteOption[]
  value: string[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  onChange: (value: string[]) => void
  disabled?: boolean
  maxTags?: number
  errorMessage?: string
  className?: string
  isRenderInPortal?: boolean
} & Omit<ComponentProps<'div'>, 'onChange'>

export const Autocomplete = ({
  label,
  placeholder = 'Search and select...',
  options,
  value,
  searchTerm,
  setSearchTerm,
  onChange,
  disabled = false,
  maxTags,
  errorMessage,
  className,
  isRenderInPortal = false,
  ...props
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // For detecting clicks outside component to close dropdown
  const containerRef = useRef<HTMLDivElement>(null)
  // For programmatic focus management (Escape key, focus after selection)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const id = useGetId(props.id)

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) && !value.includes(option.value)
  )

  const isMaxTagsReached = maxTags ? value.length >= maxTags : false
  const showError = Boolean(errorMessage)

  // Close dropdown on outside click (учитываем портал)
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (containerRef.current && !containerRef.current.contains(target)) {
        if (isRenderInPortal) {
          if (
            inputWrapperRef.current &&
            !inputWrapperRef.current.contains(target) &&
            dropdownRef.current &&
            !dropdownRef.current.contains(target)
          ) {
            setIsOpen(false)
            setFocusedIndex(-1)
          }
        } else {
          setIsOpen(false)
          setFocusedIndex(-1)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, isRenderInPortal])

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break

      case 'Enter':
        e.preventDefault()
        if (isOpen && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          selectOption(filteredOptions[focusedIndex])
        }
        break

      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        inputRef.current?.blur()
        break

      case 'Backspace':
        if (!searchTerm && value.length > 0) {
          removeTag(value[value.length - 1])
        }
        break
    }
  }

  const selectOption = (option: AutocompleteOption) => {
    if (option.disabled || isMaxTagsReached) return

    onChange([...value, option.value])
    setSearchTerm('')
    setFocusedIndex(-1)
    inputRef.current?.focus()
  }

  const removeTag = (tagValue: string) => {
    onChange(value.filter((v) => v !== tagValue))
  }

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
    setFocusedIndex(-1)
  }

  const selectedOptions = options.filter((option) => value.includes(option.value))

  return (
    <div className={clsx(s.container, className)} ref={containerRef} {...props}>
      {label && (
        <Typography
          variant="label"
          className={clsx(s.label, showError && s.labelError)}
          as="label"
          htmlFor={id}>
          {label}
        </Typography>
      )}

      <div
        className={clsx(
          s.inputWrapper,
          isOpen && s.focused,
          showError && s.error,
          disabled && s.disabled
        )}
        ref={inputWrapperRef}>
        {/* Selected tags */}
        {selectedOptions.map((option) => (
          <div key={option.value} className={s.tag}>
            <Typography variant="body2" className={s.tagText} as="label">
              {option.label}
            </Typography>
            {!disabled && (
              <IconButton
                onClick={() => removeTag(option.value)}
                className={s.deleteButton}
                aria-label={`Remove ${option.label}`}
                type="button"
                tabIndex={-1}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        ))}

        {/* Search input */}
        <div className={s.inputContainer}>
          <input
            id={id}
            ref={inputRef}
            type="text"
            className={s.input}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled || isMaxTagsReached}
            autoComplete="off"
          />
        </div>

        {/* Dropdown arrow */}
        <ArrowDownIcon
          className={clsx(s.dropdownIcon, isOpen && s.dropdownIconOpen)}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
      </div>

      {/* Dropdown через портал */}
      {isRenderInPortal ? (
        <AutocompleteDropdownPortal
          anchorRef={inputWrapperRef}
          dropdownRef={dropdownRef}
          isOpen={isOpen && !disabled}>
          <div className={s.dropdown}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={clsx(
                    s.option,
                    index === focusedIndex && s.optionFocused,
                    option.disabled && s.optionDisabled
                  )}
                  onClick={() => !option.disabled && selectOption(option)}
                  onMouseEnter={() => setFocusedIndex(index)}>
                  <Typography variant="body2">{option.label}</Typography>
                </div>
              ))
            ) : (
              <div className={s.noResults}>
                <Typography variant="body2" className={s.noResultsText}>
                  {searchTerm ? 'No options found' : 'All options selected'}
                </Typography>
              </div>
            )}
          </div>
        </AutocompleteDropdownPortal>
      ) : (
        isOpen &&
        !disabled && (
          <div className={s.dropdown}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={clsx(
                    s.option,
                    index === focusedIndex && s.optionFocused,
                    option.disabled && s.optionDisabled
                  )}
                  onClick={() => !option.disabled && selectOption(option)}
                  onMouseEnter={() => setFocusedIndex(index)}>
                  <Typography variant="body2">{option.label}</Typography>
                </div>
              ))
            ) : (
              <div className={s.noResults}>
                <Typography variant="body2" className={s.noResultsText}>
                  {searchTerm ? 'No options found' : 'All options selected'}
                </Typography>
              </div>
            )}
          </div>
        )
      )}

      {/* Error message */}
      {showError && (
        <Typography variant="error" className={s.errorMessage}>
          {errorMessage}
        </Typography>
      )}

      {/* Tags counter */}
      {maxTags && (
        <Typography variant="caption" className={s.counter}>
          {value.length}/{maxTags} selected
        </Typography>
      )}
    </div>
  )
}

// Portal for dropdown
type AutocompleteDropdownPortalProps = {
  anchorRef: React.RefObject<HTMLElement | null>
  dropdownRef: React.RefObject<HTMLDivElement | null>
  children: ReactNode
  isOpen: boolean
}

const AutocompleteDropdownPortal = ({
  anchorRef,
  dropdownRef,
  children,
  isOpen,
}: AutocompleteDropdownPortalProps) => {
  const [styles, setStyles] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  })

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setStyles({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isOpen, anchorRef])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: styles.top,
        left: styles.left,
        width: styles.width,
      }}>
      {children}
    </div>,
    document.body
  )
}
