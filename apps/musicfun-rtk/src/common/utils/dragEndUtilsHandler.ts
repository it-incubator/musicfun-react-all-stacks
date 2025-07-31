import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

// Items: tracks TrackDetails<PlaylistItemAttributes>[]
// Items: playlists Playlist[]
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

  // Local update
  // https://docs.dndkit.com/presets/sortable#overview
  const oldIndex = items.findIndex((t) => t.id === activeId)
  const newIndex = items.findIndex((t) => t.id === overId)
  if (oldIndex === -1 || newIndex === -1) return
  const newList = arrayMove(items, oldIndex, newIndex)
  setItems(newList)

  // Send new order to server (putAfterItemId = id of previous item in list)
  return newIndex > 0 ? newList[newIndex - 1].id : null
}
