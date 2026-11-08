import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useRef } from "react"

/**
 * Sensors shared by the list and kanban views.
 * A drag needs 5px of movement, so a plain click still opens the task.
 * Enter is reserved for opening a task, so the keyboard drag starts with Space.
 */
export const useTaskDnd = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space"] },
    }),
  )

  // The click that ends a drag must not open the task
  const lastDragEndAt = useRef(0)
  const markDragEnd = () => {
    lastDragEndAt.current = Date.now()
  }
  const wasJustDragged = () => Date.now() - lastDragEndAt.current < 250

  return { sensors, markDragEnd, wasJustDragged }
}
