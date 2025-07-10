import { type ChangeEvent, useEffect, useState, useRef } from 'react'
import { IconButton, SearchInput } from '@/common/components'
import s from './AutoComplete.module.css'
import { CloseIcon } from '@/common/icons'

export type Item = {
  id: string
  name: string
}

type Props = {
  allItems: Item[]
  items: Item[]
  setSearch: (search: string) => void
  isPending: boolean
  setValues: (item: string[]) => void
  search: string
  placeholder: string
  selectedIds: string[]
}

export const AutoComplete = ({
  allItems,
  items,
  setValues,
  setSearch,
  isPending,
  search,
  placeholder,
  selectedIds,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedOptions = allItems.filter((item) => selectedIds.includes(item.id))
  const isSelected = (id: string) => selectedOptions.some((selected) => selected.id === id)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addItemToSelected = (id: string) => {
    if (!isSelected(id)) {
      setValues([id, ...selectedIds])
      setSearch('')
    }
  }

  const removeItemFromSelected = (id: string) => {
    setValues(selectedIds.filter((i) => i !== id))
  }

  const onCheckedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value
    const checked = e.target.checked
    if (checked) {
      addItemToSelected(id)
    } else {
      removeItemFromSelected(id)
    }
  }

  const itemsForDropDown =
    items.length > 0 ? (
      items.map((item) => (
        <label className={s.option} key={item.id}>
          <input type={'checkbox'} onChange={onCheckedChange} value={item.id} checked={isSelected(item.id)} />
          <span>#{item.name}</span>
        </label>
      ))
    ) : (
      <label className={s.option}>
        <span>{'No matches'}</span>
      </label>
    )

  const wrapperClassName = s.inputWrapper + (isOpen ? ' ' + s.focus : '')

  return (
    <div ref={wrapperRef}>
      <div className={wrapperClassName} onClick={() => setIsOpen(true)}>
        {selectedOptions.slice(0, 4).map((item) => (
          <div key={item.id} className={s.item}>
            <span>#{item.name}</span>
            <IconButton onClick={() => removeItemFromSelected(item.id)}>
              <CloseIcon color={'#A9A9A9'} />
            </IconButton>
          </div>
        ))}
        {selectedOptions.length > 4 && <span className={s.more}>and {selectedOptions.length - 4} more</span>}
        <SearchInput title={''} isPending={isPending} placeholder={placeholder} search={search} setSearch={setSearch} />
      </div>
      {isOpen && <div className={s.dropdown}>{itemsForDropDown}</div>}
    </div>
  )
}
