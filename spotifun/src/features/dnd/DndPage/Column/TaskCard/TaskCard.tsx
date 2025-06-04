import type { Task } from "@/features/dnd/DndPage/DndPage.tsx"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

type Props = {
  task: Task
}

export const TaskCard = ({ task }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id })

  const style = {
    background: "lightblue",
    margin: "10px",
    padding: "10px",
    cursor: "grab",
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
  )
}
