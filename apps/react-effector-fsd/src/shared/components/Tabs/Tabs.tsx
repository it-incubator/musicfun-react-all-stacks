import { clsx } from 'clsx'
import { type ComponentProps, createContext, type ReactNode, use, useState } from 'react'

import s from './Tabs.module.css'

type TabsContextType = {
  value?: string
  onValueChange?: (value: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

const useTabsContext = () => {
  const context = use(TabsContext)
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs component')
  }
  return context
}

/*
 * Tabs
 */

export type TabsProps = {
  children: ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
} & ComponentProps<'div'>

export const Tabs = ({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  ...props
}: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <div className={className} {...props}>
      <TabsContext value={{ value, onValueChange: handleValueChange }}>{children}</TabsContext>
    </div>
  )
}

/*
 * TabsList
 */

export type TabsListProps = {
  children: ReactNode
  className?: string
}

export const TabsList = ({ children, className }: TabsListProps) => {
  return <div className={clsx(s.tabsList, className)}>{children}</div>
}

/*
 * TabsTrigger
 */

export type TabsTriggerProps = {
  children: ReactNode
  value: string
  className?: string
  disabled?: boolean
}

export const TabsTrigger = ({ children, value, className, disabled }: TabsTriggerProps) => {
  const { value: activeValue, onValueChange } = useTabsContext()
  const isActive = activeValue === value

  const handleClick = () => {
    if (!disabled) {
      onValueChange?.(value)
    }
  }

  return (
    <button
      className={clsx(s.tabsTrigger, isActive && s.active, disabled && s.disabled, className)}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}

/*
 * TabsContent
 */

export type TabsContentProps = {
  children: ReactNode
  value: string
  className?: string
}

export const TabsContent = ({ children, value, className }: TabsContentProps) => {
  const { value: activeValue } = useTabsContext()
  const isActive = activeValue === value

  if (!isActive) return null

  return <div className={clsx(s.tabsContent, className)}>{children}</div>
}
