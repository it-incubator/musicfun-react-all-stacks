import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import Box from "@mui/material/Box"
import { alpha } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useNavigate } from "react-router"

import { TaskStatus } from "@/common/enums"
import { taskPath } from "@/common/routing"

import { usePatchTaskMutation } from "../../api/tasksApi.ts"
import type { BoardTask } from "../../api/tasksApi.types.ts"
import { STATUS_META, STATUS_ORDER } from "../../lib/taskMeta.ts"
import { useTaskDnd } from "../../lib/useTaskDnd.ts"
import { TaskCard } from "../TaskCard/TaskCard.tsx"

type Props = {
  boardId: string
  tasks: BoardTask[]
  isOwner: boolean
}

const columnId = (status: TaskStatus) => `column-${status}`

// Prefer the column under the pointer, fall back to the closest one
const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  return pointerCollisions.length ? pointerCollisions : rectIntersection(args)
}

export const KanbanView = ({ boardId, tasks, isOwner }: Props) => {
  const navigate = useNavigate()
  const [patchTask] = usePatchTaskMutation()
  const { sensors, markDragEnd, wasJustDragged } = useTaskDnd()
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null)

  const openTask = (taskId: string) => {
    if (!wasJustDragged()) navigate(taskPath(boardId, taskId))
  }

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    markDragEnd()
    setActiveTask(null)
    if (!over) return
    const status = over.data.current?.status as TaskStatus | undefined
    const task = tasks.find((t) => t.id === active.id)
    if (task && status !== undefined && task.attributes.status !== status) {
      // PATCH — moving between columns changes only the status
      patchTask({ boardId, taskId: task.id, attributes: { status } })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        markDragEnd()
        setActiveTask(null)
      }}
    >
      <Box
        data-testid="kanban"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(4, minmax(260px, 1fr))", lg: "repeat(4, 1fr)" },
          gap: 2,
          overflowX: "auto",
          pb: 2,
          alignItems: "start",
        }}
      >
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.attributes.status === status)}
            boardId={boardId}
            isOwner={isOwner}
            onOpen={openTask}
          />
        ))}
      </Box>
      <DragOverlay dropAnimation={null}>
        {activeTask && <TaskCard task={activeTask} boardId={boardId} isOwner={isOwner} showStatus={false} isOverlay />}
      </DragOverlay>
    </DndContext>
  )
}

type ColumnProps = {
  status: TaskStatus
  tasks: BoardTask[]
  boardId: string
  isOwner: boolean
  onOpen: (taskId: string) => void
}

const KanbanColumn = ({ status, tasks, boardId, isOwner, onOpen }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: columnId(status), data: { status }, disabled: !isOwner })
  const { label, color } = STATUS_META[status]

  return (
    <Box
      ref={setNodeRef}
      data-testid={`kanban-column-${status}`}
      aria-label={`${label} column`}
      sx={{
        borderRadius: 3,
        p: 1.25,
        minHeight: 160,
        bgcolor: (theme) => (isOver ? alpha(color, 0.12) : theme.palette.mode === "dark" ? "#11161D" : "#ECEEF3"),
        outline: isOver ? `2px dashed ${color}` : "2px dashed transparent",
        transition: "background-color .15s, outline-color .15s",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 0.75, pb: 1.25 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
        <Typography variant="subtitle2" fontWeight={700}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto", fontWeight: 600 }}>
          {tasks.length}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {tasks.map((task) => (
          <DraggableTask key={task.id} task={task} boardId={boardId} isOwner={isOwner} onOpen={() => onOpen(task.id)} />
        ))}
        {tasks.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3, opacity: 0.7 }}>
            {isOwner ? "Drop tasks here" : "No tasks"}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

type DraggableTaskProps = {
  task: BoardTask
  boardId: string
  isOwner: boolean
  onOpen: () => void
}

const DraggableTask = ({ task, boardId, isOwner, onOpen }: DraggableTaskProps) => {
  const { listeners, setNodeRef, isDragging } = useDraggable({ id: task.id, disabled: !isOwner })

  return (
    <Box
      ref={setNodeRef}
      // only listeners: dnd-kit `attributes` would mark read-only cards aria-disabled
      {...listeners}
      sx={{ touchAction: "manipulation" }}
    >
      <TaskCard
        task={task}
        boardId={boardId}
        isOwner={isOwner}
        showStatus={false}
        isDragging={isDragging}
        onOpen={onOpen}
      />
    </Box>
  )
}
