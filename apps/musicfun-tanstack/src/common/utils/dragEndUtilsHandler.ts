import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

// items: tracks TrackDetails<PlaylistItemAttributes>[]
// items: playlists Playlist[]
type ArgsType<T> = {
  event: DragEndEvent
  items: T[]
  setItems: (items: T[]) => void
}

export const dragEndUtilsHandler = <T extends { id: string }>(args: ArgsType<T>) => {
  const { items, setItems, event } = args
  const { active, over } = event
  const activeId = active.id as string
  const overId = over && (over.id as string)

  if (!overId || activeId === overId) return

  // Локальное обновление
  // https://docs.dndkit.com/presets/sortable#overview
  const oldIndex = items.findIndex((t) => t.id === activeId)
  const newIndex = items.findIndex((t) => t.id === overId)
  if (oldIndex === -1 || newIndex === -1) return
  const newList = arrayMove(items, oldIndex, newIndex)
  setItems(newList)

  // Отправляем на сервер новый порядок (putAfterItemId = id предыдущего в списке)
  return newIndex > 0 ? newList[newIndex - 1].id : null
}
