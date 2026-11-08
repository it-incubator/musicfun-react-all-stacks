/** Moves the item right after `putAfterItemId` (null → first), mirroring the backend reorder semantics */
export const moveAfter = <T extends { id: string }>(items: T[], id: string, putAfterItemId: string | null): T[] => {
  const item = items.find((i) => i.id === id)
  if (!item) return items
  const rest = items.filter((i) => i.id !== id)
  const index = putAfterItemId === null ? 0 : rest.findIndex((i) => i.id === putAfterItemId) + 1
  rest.splice(index, 0, item)
  return rest
}

/** For a list after drag & drop: the id of the item before `index`, as the reorder endpoints expect */
export const getPutAfterItemId = <T extends { id: string }>(items: T[], index: number) =>
  index === 0 ? null : items[index - 1].id
