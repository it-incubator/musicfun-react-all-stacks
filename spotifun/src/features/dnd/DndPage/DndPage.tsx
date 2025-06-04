import { Column } from "@/features/dnd/DndPage/Column/Column.tsx"
import { useState } from "react"
import { Draggable } from "./Draggable/Draggable.tsx"
import { Droppable } from "./Droppable/Droppable.tsx"
import { DndContext, type DragEndEvent, type UniqueIdentifier } from "@dnd-kit/core"

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"

export type Task = {
  id: string
  status: TaskStatus
  title: string
  description: string
}

export type ColumnType = {
  id: TaskStatus
  title: string
}

const COLUMNS: ColumnType[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
]

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Research Project",
    description: "Gather requirements and create initial documentation",
    status: "TODO",
  },
  {
    id: "2",
    title: "Design System",
    description: "Create component library and design tokens",
    status: "TODO",
  },
  {
    id: "3",
    title: "API Integration",
    description: "Implement REST API endpoints",
    status: "IN_PROGRESS",
  },
  {
    id: "4",
    title: "Testing",
    description: "Write unit tests for core functionality",
    status: "DONE",
  },
]

export const DndPage = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)

  const containers = ["A", "B", "C"]
  const [parent, setParent] = useState<UniqueIdentifier | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event
    setParent(over ? over.id : null)
  }

  const handleDragEnd2 = (event: DragEndEvent) => {
    const { over, active } = event
    debugger
    if (!over) return
    const newTasks = tasks.map((task) => {
      return task.id === active.id ? { ...task, status: over.id as TaskStatus } : task
    })
    setTasks(newTasks)
  }

  return (
    <div className={"flex-container-column"}>
      <div className={"flex-container"} style={{ marginBottom: "100px" }}>
        <DndContext onDragEnd={handleDragEnd}>
          {parent === null ? <Draggable id="draggable">Drag me</Draggable> : null}

          {containers.map((id) => {
            return (
              <Droppable key={id} id={id}>
                {parent === id ? (
                  <Draggable id="draggable">Drag me</Draggable>
                ) : (
                  <div style={{ width: "200px", height: "200px", border: "2px solid blue" }}>{`Drop here ${id}`}</div>
                )}
              </Droppable>
            )
          })}
        </DndContext>
      </div>

      <DndContext onDragEnd={handleDragEnd2}>
        <div className={"flex-container"}>
          {COLUMNS.map((column) => {
            return <Column key={column.id} column={column} tasks={tasks.filter((task) => task.status === column.id)} />
          })}
        </div>
      </DndContext>
    </div>
  )
}
