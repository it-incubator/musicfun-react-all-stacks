import { clsx } from 'clsx'
import {
  type ComponentProps,
  createContext,
  type ElementType,
  type ReactNode,
  use,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import s from './DropdownMenu.module.css'

type DropdownMenuContextType = {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
  triggerRef: React.RefObject<HTMLElement | null>
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null)

const useDropdownMenuContext = () => {
  const context = use(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenu compound components must be used within DropdownMenu component')
  }
  return context
}

/*
 * DropdownMenu
 */

export type DropdownMenuProps = {
  children: ReactNode
  className?: string
}

export const DropdownMenu = ({ children, className }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)

  const onClose = () => setIsOpen(false)
  const onToggle = () => setIsOpen(!isOpen)

  useBlockScroll({ isOpen, triggerRef })

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (triggerRef.current && !triggerRef.current.contains(target) && !target.closest('[data-dropdown-content]')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const contextValue = {
    isOpen,
    onClose,
    onToggle,
    triggerRef,
  }

  return (
    <div className={clsx(s.container, className)}>
      <DropdownMenuContext value={contextValue}>{children}</DropdownMenuContext>
    </div>
  )
}

/*
 * DropdownMenuTrigger
 */

export type DropdownMenuTriggerProps = {
  children: ReactNode
  className?: string
  asChild?: boolean
}

export const DropdownMenuTrigger = ({ children, className, asChild = false }: DropdownMenuTriggerProps) => {
  const { onToggle, triggerRef } = useDropdownMenuContext()

  if (asChild) {
    return (
      <div ref={triggerRef as React.RefObject<HTMLDivElement>} onClick={onToggle} className={className}>
        {children}
      </div>
    )
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onToggle}
      className={clsx(s.trigger, className)}
    >
      {children}
    </button>
  )
}

/*
 * DropdownMenuContent
 */

export type DropdownMenuContentProps = {
  children: ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export const DropdownMenuContent = ({
  children,
  className,
  align = 'end',
  side = 'bottom',
}: DropdownMenuContentProps) => {
  const { isOpen, triggerRef } = useDropdownMenuContext()
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // it's needed to prevent flickering
  const [isPositioned, setIsPositioned] = useState(false)

  useEffect(() => {
    if (!isOpen || !triggerRef.current) {
      setIsPositioned(false)
      return
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    let top = 0
    let left = 0

    // Calculate position based on side
    switch (side) {
      case 'bottom':
        top = triggerRect.bottom + scrollTop + 4
        break
      case 'top':
        top = triggerRect.top + scrollTop - 4
        break
      case 'right':
        left = triggerRect.right + scrollLeft + 4
        top = triggerRect.top + scrollTop
        break
      case 'left':
        left = triggerRect.left + scrollLeft - 4
        top = triggerRect.top + scrollTop
        break
    }

    // Calculate position based on align
    if (side === 'bottom' || side === 'top') {
      switch (align) {
        case 'start':
          left = triggerRect.left + scrollLeft
          break
        case 'center':
          left = triggerRect.left + scrollLeft + triggerRect.width / 2
          break
        case 'end':
          left = triggerRect.right + scrollLeft
          break
      }
    }

    setPosition({ top, left })
    setIsPositioned(true)
  }, [isOpen, align, side])

  if (!isOpen || !isPositioned) return null

  const content = (
    <div
      className={clsx(s.content, s[`align-${align}`], s[`side-${side}`], className)}
      style={{ top: position.top, left: position.left }}
      data-dropdown-content
      role="menu"
    >
      {children}
    </div>
  )

  return createPortal(content, document.body)
}

/*
 * DropdownMenuItem
 */

export type DropdownMenuItemProps<T extends ElementType = 'button'> = {
  as?: T
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
} & ComponentProps<T>

export const DropdownMenuItem = <T extends ElementType = 'button'>({
  as: Component = 'button',
  children,
  onClick,
  className,
  disabled = false,
  ...props
}: DropdownMenuItemProps<T>) => {
  const { onClose } = useDropdownMenuContext()

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    onClose()
  }

  const isButton = Component === 'button'

  return (
    <Component
      {...(isButton && { type: 'button' })}
      className={clsx(s.item, disabled && s.itemDisabled, className)}
      onClick={handleClick}
      {...(isButton && { disabled })}
      role="menuitem"
      {...props}
    >
      {children}
    </Component>
  )
}

/*
 * DropdownMenuSeparator
 */

export type DropdownMenuSeparatorProps = {
  className?: string
}

export const DropdownMenuSeparator = ({ className }: DropdownMenuSeparatorProps) => {
  return <div className={clsx(s.separator, className)} role="separator" />
}

/**
 * Block scroll when menu is open.
 */
const useBlockScroll = ({
  isOpen,
  triggerRef,
}: {
  isOpen: boolean
  triggerRef: React.RefObject<HTMLElement | null>
}) => {
  // Block scroll when menu is open
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const originalScrollElements: Array<{ element: Element; overflow: string }> = []

    // Find all scrollable parent elements
    const findScrollableParents = (element: Element) => {
      const scrollableElements: Element[] = []
      let parent = element.parentElement

      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent)
        const hasVerticalScroll =
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll' ||
          style.overflow === 'auto' ||
          style.overflow === 'scroll'

        if (hasVerticalScroll && parent.scrollHeight > parent.clientHeight) {
          scrollableElements.push(parent)
        }
        parent = parent.parentElement
      }

      return scrollableElements
    }

    // Block scroll on body
    const bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    originalScrollElements.push({ element: document.body, overflow: bodyOverflow })

    // Block scroll on scrollable parents
    const scrollableParents = findScrollableParents(triggerRef.current)
    scrollableParents.forEach((element) => {
      const originalOverflow = (element as HTMLElement).style.overflow
      ;(element as HTMLElement).style.overflow = 'hidden'
      originalScrollElements.push({ element, overflow: originalOverflow })
    })

    return () => {
      // Restore original overflow values
      originalScrollElements.forEach(({ element, overflow }) => {
        ;(element as HTMLElement).style.overflow = overflow
      })
    }
  }, [isOpen])
}
