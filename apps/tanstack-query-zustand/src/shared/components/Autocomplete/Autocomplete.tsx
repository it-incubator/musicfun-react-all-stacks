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
import {
  ArrowDownIcon,
  SearchIcon,
  CheckedIcon,
  UncheckedIcon,
  DeleteTagIconButton,
} from '@/shared/icons'

import { IconButton } from '../IconButton'
import { Typography } from '../Typography'
import s from './Autocomplete.module.css'
import { useTranslation } from 'react-i18next'

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
  searchTerm?: string
  setSearchTerm?: (value: string) => void
  onChange: (value: string[]) => void
  disabled?: boolean
  maxTags?: number
  errorMessage?: string
  className?: string
  isRenderInPortal?: boolean
} & Omit<ComponentProps<'div'>, 'onChange'>

export const Autocomplete = ({
  label,
  placeholder,
  options,
  value,
  searchTerm: externalSearchTerm,
  setSearchTerm: externalSetSearchTerm,
  onChange,
  disabled = false,
  maxTags,
  errorMessage,
  className,
  isRenderInPortal = false,
  ...props
}: AutocompleteProps) => {
  const { t } = useTranslation()
  const [internalSearchTerm, setInternalSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const hiddenTagsBlockRef = useRef<HTMLDivElement>(null)

  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm
  const setSearchTerm = externalSetSearchTerm || setInternalSearchTerm

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const id = useGetId(props.id)

  const filteredOptions = options

  const isMaxTagsReached = maxTags ? value.length >= maxTags : false
  const showError = Boolean(errorMessage)

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
          toggleOption(filteredOptions[focusedIndex])
        }
        break

      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  const toggleOption = (option: AutocompleteOption) => {
    if (option.disabled) return

    const isSelected = value.includes(option.value)

    if (isSelected) {
      onChange(value.filter((v) => v !== option.value))
    } else if (!isMaxTagsReached) {
      onChange([...value, option.value])
    }
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

  const maxVisibleTags = 2
  const visibleTags = selectedOptions.slice(0, maxVisibleTags)
  const hiddenTagsCount = selectedOptions.length - maxVisibleTags
  const hiddenTags = selectedOptions.slice(maxVisibleTags)

  useEffect(() => {
    if (isPopupOpen && hiddenTagsBlockRef.current) {
      hiddenTagsBlockRef.current.focus()
    }
  }, [isPopupOpen])

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
        <div className={s.tagsWrapper}>
          {visibleTags.map((option) => (
            <div key={option.value} className={s.tag} title={option.label}>
              <Typography variant="body2" className={s.tagText} as="label">
                #{option.label}
              </Typography>

              {!disabled && (
                <IconButton
                  onClick={() => removeTag(option.value)}
                  className={s.deleteButton}
                  type="button"
                  tabIndex={-1}>
                  <DeleteTagIconButton />
                </IconButton>
              )}
            </div>
          ))}

          {hiddenTagsCount > 0 && (
            <div className={s.hidenTags}>
              <Typography variant="body2" className={s.tagText}>
                and{' '}
                <button
                  className={s.underlinedPart}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPopupOpen(!isPopupOpen)
                  }}>
                  {hiddenTagsCount} more
                </button>
              </Typography>
            </div>
          )}
        </div>
        {isPopupOpen && hiddenTagsCount > 0 && (
          <div
            className={s.hiddenTagsBlock}
            ref={hiddenTagsBlockRef}
            tabIndex={0}
            autoFocus
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsPopupOpen(false)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsPopupOpen(false)
              }
            }}>
            {hiddenTags.map((option) => (
              <div key={option.value} className={s.tag} title={option.label}>
                <Typography variant="body2" className={s.tagText} as="label">
                  #{option.label}
                </Typography>

                {!disabled && (
                  <IconButton
                    onClick={() => removeTag(option.value)}
                    className={s.deleteButton}
                    type="button"
                    tabIndex={-1}>
                    <DeleteTagIconButton />
                  </IconButton>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={s.inputContainer}>
          <SearchIcon width={20} height={20} />
          <input
            id={id}
            ref={inputRef}
            type="text"
            className={s.input}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t('placeholder.search_and_select')}
            disabled={disabled || isMaxTagsReached}
            autoComplete="off"
          />
        </div>
        <ArrowDownIcon
          className={clsx(s.dropdownIcon, isOpen && s.dropdownIconOpen)}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && !disabled && (
        <div className={s.dropdown}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isSelected = value.includes(option.value)

              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  className={clsx(
                    s.option,
                    index === focusedIndex && s.optionFocused,
                    option.disabled && s.optionDisabled,
                    isSelected && s.selected
                  )}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => !option.disabled && toggleOption(option)}
                  onMouseLeave={() => setFocusedIndex(-1)}>
                  {isSelected ? <CheckedIcon /> : <UncheckedIcon />}
                  <Typography variant="body2">#{option.label}</Typography>
                </div>
              )
            })
          ) : (
            <div className={s.noResults}>
              <Typography variant="body2" className={s.noResultsText}>
                {searchTerm
                  ? t('placeholder.no_options_found')
                  : t('placeholder.all_options_selected')}
              </Typography>
            </div>
          )}
        </div>
      )}

      {showError && (
        <Typography variant="error" className={s.errorMessage}>
          {errorMessage}
        </Typography>
      )}

      {maxTags && (
        <Typography variant="caption" className={s.counter}>
          {value.length}/{maxTags} {t('placeholder.selected')}
        </Typography>
      )}
    </div>
  )
}
