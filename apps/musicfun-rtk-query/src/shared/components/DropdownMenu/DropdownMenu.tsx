import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'
import { clsx } from 'clsx'
import { type ComponentProps, type ElementType, type ReactNode } from 'react'

import s from './DropdownMenu.module.css'

/*
 * DropdownMenu
 */

export type DropdownMenuProps = {
  children: ReactNode
  className?: string
}

export const DropdownMenu = ({ children, className }: DropdownMenuProps) => {
  return (
    <Menu as="div" className={clsx(s.container, className)}>
      {children}
    </Menu>
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

export const DropdownMenuTrigger = ({
  children,
  className,
  asChild = false,
}: DropdownMenuTriggerProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  if (asChild) {
    return (
      <MenuButton as="div" className={className} onClick={handleClick}>
        {children}
      </MenuButton>
    )
  }

  return (
    <MenuButton className={clsx(s.trigger, className)} onClick={handleClick}>
      {children}
    </MenuButton>
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
  return (
    <MenuItems
      portal
      anchor="bottom"
      className={clsx(s.content, s[`align-${align}`], s[`side-${side}`], className)}>
      {children}
    </MenuItems>
  )
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
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (disabled) return
    onClick?.()
  }

  return (
    <MenuItem disabled={disabled}>
      <Component
        {...(Component === 'button' && { type: 'button' })}
        className={clsx(s.item, disabled && s.itemDisabled, className)}
        onClick={handleClick}
        {...(Component === 'button' && { disabled })}
        {...props}>
        {children}
      </Component>
    </MenuItem>
  )
}

/*
 * DropdownMenuSeparator
 */

export type DropdownMenuSeparatorProps = {
  className?: string
}

export const DropdownMenuSeparator = ({ className }: DropdownMenuSeparatorProps) => {
  return <MenuSeparator className={clsx(s.separator, className)} />
}
