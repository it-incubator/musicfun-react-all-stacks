import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ChecklistIcon from "@mui/icons-material/Checklist"
import SearchIcon from "@mui/icons-material/Search"
import StarIcon from "@mui/icons-material/Star"
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined"
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Container from "@mui/material/Container"
import InputAdornment from "@mui/material/InputAdornment"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { Link, Outlet, useNavigate, useParams } from "react-router"

import { EmptyState, ErrorState, PageNotFound } from "@/common/components"
import { LIMITS, LOCALSTORAGE_KEYS } from "@/common/constants"
import { TaskStatus } from "@/common/enums"
import { Path } from "@/common/routing"
import { formatDate, isNotFoundError } from "@/common/utils"
import { useAuth } from "@/features/auth/lib/useAuth.ts"
import { selectIsMyBoard, useGetBoardQuery, useGetMyBoardsQuery } from "@/features/boards/api/boardsApi.ts"
import type { Board } from "@/features/boards/api/boardsApi.types.ts"
import { BoardActions } from "@/features/boards/ui/BoardActions/BoardActions.tsx"
import { BoardCover } from "@/features/boards/ui/BoardCover/BoardCover.tsx"
import { ImportantToggle } from "@/features/boards/ui/ImportantToggle/ImportantToggle.tsx"
import { BOARD_TASKS_ARGS, useGetBoardTasksQuery } from "@/features/tasks/api/tasksApi.ts"
import { STATUS_META, STATUS_ORDER } from "@/features/tasks/lib/taskMeta.ts"
import { AddTaskForm } from "@/features/tasks/ui/AddTaskForm/AddTaskForm.tsx"
import { KanbanView } from "@/features/tasks/ui/KanbanView/KanbanView.tsx"
import { TaskListView } from "@/features/tasks/ui/TaskListView/TaskListView.tsx"

type BoardView = "list" | "kanban"

export type BoardOutletContext = { isOwner: boolean }

const getSavedView = (): BoardView =>
  localStorage.getItem(LOCALSTORAGE_KEYS.boardView) === "kanban" ? "kanban" : "list"

export const BoardPage = () => {
  const { boardId = "" } = useParams()
  const { isAuthed } = useAuth()

  const { data: board, isLoading, isError, error, refetch } = useGetBoardQuery(boardId)
  const { data: myBoards } = useGetMyBoardsQuery(undefined, { skip: !isAuthed })
  const isOwner = selectIsMyBoard(myBoards?.data, boardId)

  if (isError && isNotFoundError(error)) {
    return <PageNotFound title="Board not found" description="This board doesn’t exist or has been deleted." />
  }

  if (isError && !board) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <ErrorState title="Couldn’t load the board" onRetry={refetch} />
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Button
        component={Link}
        to={isOwner ? Path.MyBoards : Path.Main}
        startIcon={<ArrowBackIcon />}
        color="inherit"
        size="small"
        sx={{ mb: 2, color: "text.secondary" }}
      >
        {isOwner ? "My boards" : "Explore"}
      </Button>

      {isLoading || !board ? <BoardHeaderSkeleton /> : <BoardHeader board={board.data} isOwner={isOwner} />}

      <BoardTasks boardId={boardId} isOwner={isOwner} />

      <Outlet context={{ isOwner } satisfies BoardOutletContext} />
    </Container>
  )
}

const BoardHeader = ({ board, isOwner }: { board: Board; isOwner: boolean }) => {
  const navigate = useNavigate()
  const { title, description, isImportant, addedAt, updatedAt } = board.attributes

  return (
    <Box sx={{ mb: 4 }}>
      <BoardCover board={board} height={{ xs: 120, md: 180 }} sx={{ borderRadius: 4, mb: 3 }} />
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h4" component="h1" sx={{ wordBreak: "break-word" }} data-testid="board-title">
            {!isOwner && isImportant && (
              <StarIcon aria-label="Important" sx={{ color: "secondary.main", mr: 1, verticalAlign: "-3px" }} />
            )}
            {title}
          </Typography>
          {description && (
            <Typography
              color="text.secondary"
              sx={{ mt: 1, whiteSpace: "pre-wrap", wordBreak: "break-word", maxWidth: 820 }}
              data-testid="board-description"
            >
              {description}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
            Created {formatDate(addedAt)} · Updated {formatDate(updatedAt)}
          </Typography>
        </Box>
        {isOwner && (
          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
            <ImportantToggle board={board} sx={{ border: 1, borderColor: "divider" }} />
            <BoardActions
              board={board}
              onDeleted={() => navigate(Path.MyBoards)}
              buttonSx={{ border: 1, borderColor: "divider" }}
            />
          </Stack>
        )}
      </Box>
    </Box>
  )
}

const BoardTasks = ({ boardId, isOwner }: { boardId: string; isOwner: boolean }) => {
  const { data, isLoading } = useGetBoardTasksQuery(BOARD_TASKS_ARGS(boardId))

  const [view, setView] = useState<BoardView>(getSavedView)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")

  const changeView = (value: BoardView | null) => {
    if (!value) return
    setView(value)
    localStorage.setItem(LOCALSTORAGE_KEYS.boardView, value)
  }

  const tasks = data?.data ?? []
  const totalCount = data?.meta.totalCount ?? 0
  const query = search.trim().toLowerCase()

  const visibleTasks = tasks.filter(
    (task) =>
      (!query || task.attributes.title.toLowerCase().includes(query)) &&
      (view === "kanban" || statusFilter === "all" || task.attributes.status === statusFilter),
  )
  const isFiltered = !!query || (view === "list" && statusFilter !== "all")
  const completedCount = tasks.filter((t) => t.attributes.status === TaskStatus.Completed).length

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mr: 1 }}>
          Tasks
        </Typography>
        {!isLoading && (
          <Chip
            size="small"
            icon={<ChecklistIcon />}
            label={`${completedCount}/${totalCount} done · ${totalCount}/${LIMITS.tasksPerBoard}`}
            data-testid="tasks-counter"
          />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <TextField
          size="small"
          placeholder="Search tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            htmlInput: { "aria-label": "Search tasks" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: "100%", sm: 220 }, "& .MuiOutlinedInput-root": { bgcolor: "background.paper" } }}
        />
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, value) => changeView(value)}
          aria-label="Board view"
          sx={{ bgcolor: "background.paper" }}
        >
          <ToggleButton value="list" aria-label="List view">
            <ViewAgendaOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} /> List
          </ToggleButton>
          <ToggleButton value="kanban" aria-label="Kanban view">
            <ViewKanbanOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} /> Kanban
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {isOwner && (
        <Box sx={{ mb: 2.5 }}>
          <AddTaskForm boardId={boardId} tasksCount={totalCount} />
        </Box>
      )}

      {view === "list" && tasks.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
          <Chip
            label="All"
            onClick={() => setStatusFilter("all")}
            color={statusFilter === "all" ? "primary" : "default"}
            variant={statusFilter === "all" ? "filled" : "outlined"}
          />
          {STATUS_ORDER.map((status) => (
            <Chip
              key={status}
              label={STATUS_META[status].label}
              onClick={() => setStatusFilter(status)}
              color={statusFilter === status ? "primary" : "default"}
              variant={statusFilter === status ? "filled" : "outlined"}
            />
          ))}
        </Stack>
      )}

      {isLoading ? (
        <Stack spacing={1.25} sx={{ maxWidth: 820 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} variant="rounded" height={72} />
          ))}
        </Stack>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<ChecklistIcon />}
          title="No tasks yet"
          description={isOwner ? "Add the first task above. New tasks appear at the top." : "This board is empty."}
        />
      ) : view === "kanban" ? (
        <KanbanView boardId={boardId} tasks={visibleTasks} isOwner={isOwner} />
      ) : visibleTasks.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4 }}>
          No tasks match the filter
        </Typography>
      ) : (
        <>
          {isOwner && isFiltered && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Clear filters to reorder tasks
            </Typography>
          )}
          <TaskListView boardId={boardId} tasks={visibleTasks} isOwner={isOwner} canReorder={!isFiltered} />
        </>
      )}
    </Box>
  )
}

const BoardHeaderSkeleton = () => (
  <Box sx={{ mb: 4 }}>
    <Skeleton variant="rounded" height={180} sx={{ borderRadius: 4, mb: 3 }} />
    <Skeleton width="40%" height={48} />
    <Skeleton width="60%" />
  </Box>
)
