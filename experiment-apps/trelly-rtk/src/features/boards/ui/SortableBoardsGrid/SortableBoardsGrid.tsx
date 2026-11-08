import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"

import { getPutAfterItemId } from "@/common/utils"

import { useReorderBoardMutation } from "../../api/boardsApi.ts"
import type { Board } from "../../api/boardsApi.types.ts"
import { BoardCard } from "../BoardCard/BoardCard.tsx"

export const boardsGridSx = {
  display: "grid",
  gap: 2.5,
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
}

type Props = {
  boards: Board[]
}

export const SortableBoardsGrid = ({ boards }: Props) => {
  const [reorderBoard] = useReorderBoardMutation()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = boards.findIndex((b) => b.id === active.id)
    const to = boards.findIndex((b) => b.id === over.id)
    const reordered = arrayMove(boards, from, to)
    reorderBoard({ boardId: String(active.id), putAfterItemId: getPutAfterItemId(reordered, to) })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={boards.map((b) => b.id)} strategy={rectSortingStrategy}>
        <Box sx={boardsGridSx} data-testid="my-boards-grid">
          {boards.map((board, index) => (
            <SortableBoard key={board.id} board={board} isFirst={index === 0} />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  )
}

const SortableBoard = ({ board, isFirst }: { board: Board; isFirst: boolean }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: board.id,
  })

  const dragHandle = (
    <Tooltip title="Drag to reorder">
      <IconButton
        ref={setActivatorNodeRef}
        size="small"
        aria-label={`Reorder board ${board.attributes.title}`}
        {...attributes}
        {...listeners}
        onClick={(e) => e.preventDefault()}
        sx={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          bgcolor: "rgba(15, 23, 42, 0.55)",
          color: "#fff",
          backdropFilter: "blur(4px)",
          "&:hover": { bgcolor: "rgba(15, 23, 42, 0.75)" },
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  )

  return (
    <Box
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
        position: "relative",
      }}
    >
      <BoardCard board={board} isOwner isFirst={isFirst} dragHandle={dragHandle} isDragging={isDragging} />
    </Box>
  )
}
