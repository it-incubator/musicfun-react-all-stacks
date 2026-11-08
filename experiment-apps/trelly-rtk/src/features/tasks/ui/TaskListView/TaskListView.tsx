import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { useNavigate } from "react-router"

import { taskPath } from "@/common/routing"
import { getPutAfterItemId } from "@/common/utils"

import { useReorderTaskMutation } from "../../api/tasksApi.ts"
import type { BoardTask } from "../../api/tasksApi.types.ts"
import { useTaskDnd } from "../../lib/useTaskDnd.ts"
import { TaskCard } from "../TaskCard/TaskCard.tsx"

type Props = {
  boardId: string
  tasks: BoardTask[]
  isOwner: boolean
  // reordering a filtered list would be ambiguous
  canReorder: boolean
}

export const TaskListView = ({ boardId, tasks, isOwner, canReorder }: Props) => {
  const navigate = useNavigate()
  const [reorderTask] = useReorderTaskMutation()
  const { sensors, markDragEnd, wasJustDragged } = useTaskDnd()

  const openTask = (taskId: string) => {
    if (!wasJustDragged()) navigate(taskPath(boardId, taskId))
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    markDragEnd()
    if (!over || active.id === over.id) return
    const from = tasks.findIndex((t) => t.id === active.id)
    const to = tasks.findIndex((t) => t.id === over.id)
    const reordered = arrayMove(tasks, from, to)
    reorderTask({ boardId, taskId: String(active.id), putAfterItemId: getPutAfterItemId(reordered, to) })
  }

  const isSortable = isOwner && canReorder

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
      onDragCancel={markDragEnd}
    >
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy} disabled={!isSortable}>
        <Stack spacing={1.25} data-testid="task-list" sx={{ maxWidth: 820 }}>
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              boardId={boardId}
              isOwner={isOwner}
              onOpen={() => openTask(task.id)}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  )
}

type SortableTaskProps = {
  task: BoardTask
  boardId: string
  isOwner: boolean
  onOpen: () => void
}

const SortableTask = ({ task, boardId, isOwner, onOpen }: SortableTaskProps) => {
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  return (
    <Box
      ref={setNodeRef}
      // only listeners: dnd-kit `attributes` would mark read-only cards aria-disabled
      {...listeners}
      sx={{
        transform: CSS.Translate.toString(transform),
        transition,
        position: "relative",
        zIndex: isDragging ? 2 : undefined,
        touchAction: "manipulation",
      }}
    >
      <TaskCard task={task} boardId={boardId} isOwner={isOwner} onOpen={onOpen} isOverlay={isDragging} />
    </Box>
  )
}
