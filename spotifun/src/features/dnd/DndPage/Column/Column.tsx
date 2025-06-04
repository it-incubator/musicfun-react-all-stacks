import { TaskCard } from "@/features/dnd/DndPage/Column/TaskCard/TaskCard.tsx"
import { useDroppable } from "@dnd-kit/core"
import type { ColumnType, Task } from "../DndPage.tsx"

type Props = {
  column: ColumnType
  tasks: Task[]
}

export const Column = ({ column, tasks }: Props) => {
  const { isOver, setNodeRef } = useDroppable({ id: column.id })

  const style = {
    color: isOver ? "red" : "black",
    border: "1px solid green",
    minHeight: "400px",
    width: "300px",
    padding: "20px",
    cursor: "grab",
  }

  return (
    <div ref={setNodeRef} style={style}>
      <h2>{column.title}</h2>
      <div>
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />
        })}
      </div>
    </div>
  )
}
