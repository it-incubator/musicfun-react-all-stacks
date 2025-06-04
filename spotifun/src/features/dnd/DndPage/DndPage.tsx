import { Column } from "@/features/dnd/DndPage/Column/Column.tsx"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useState } from "react"

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

export const DndPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Research Project",
      description: "Gather requirements and create initial documentation",
      status: "TODO",
    },
    {
      id: "2",
      title: "API Integration",
      description: "Implement REST API endpoints",
      status: "TODO",
    },
    {
      id: "3",
      title: "Testing",
      description: "Write unit tests for core functionality",
      status: "TODO",
    },
    {
      id: "4",
      title: "Testing333",
      description: "sdfsdf fsdf sdf fsdy",
      status: "DONE",
    },
  ])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find((t) => t.id === active.id)
    if (!activeTask) return

    // Если перетаскиваем в колонку (возможно пустую)
    const isOverColumn = ["TODO", "IN_PROGRESS", "DONE"].includes(over.id as TaskStatus)

    if (isOverColumn) {
      // Просто обновляем статус
      setTasks((prev) =>
        prev.map((task) => (task.id === active.id ? { ...task, status: over.id as TaskStatus } : task)),
      )
      return
    }

    // Иначе: перетаскиваем на другую задачу — сортировка в колонке
    const overTask = tasks.find((t) => t.id === over.id)
    if (!overTask) return

    const activeColumn = activeTask.status
    const overColumn = overTask.status

    if (activeColumn !== overColumn) {
      // Меняем колонку
      setTasks((prev) => prev.map((task) => (task.id === active.id ? { ...task, status: overColumn } : task)))
      return
    }

    // Перемещаем внутри колонки
    const columnTasks = tasks.filter((t) => t.status === activeColumn)
    const oldIndex = columnTasks.findIndex((t) => t.id === active.id)
    const newIndex = columnTasks.findIndex((t) => t.id === over.id)
    const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex)

    // Объединяем с остальными задачами
    setTasks((prev) => {
      const otherTasks = prev.filter((t) => t.status !== activeColumn)
      return [...otherTasks, ...newColumnTasks]
    })
  }

  return (
    <div className={"flex-container-column"}>
      <DndContext onDragEnd={handleDragEnd}>
        <div className={"flex-container"}>
          {COLUMNS.map((column) => {
            return <Column key={column.id} column={column} tasks={tasks.filter((task) => task.status === column.id)} />
          })}
        </div>
      </DndContext>
    </div>
  )
}
