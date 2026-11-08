import CloseIcon from "@mui/icons-material/Close"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined"
import EditNoteIcon from "@mui/icons-material/EditNote"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import MenuItem from "@mui/material/MenuItem"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import { type ReactNode, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { showNotificationAC } from "@/app/model/app-slice.ts"
import { ConfirmDialog } from "@/common/components"
import { TaskPriority, TaskStatus } from "@/common/enums"
import { useAppDispatch } from "@/common/hooks"
import { boardPath } from "@/common/routing"
import { formatDate, fromDateInputValue, isNotFoundError, toDateInputValue } from "@/common/utils"

import { useDeleteTaskMutation, useGetTaskQuery, usePatchTaskMutation } from "../../api/tasksApi.ts"
import type { PatchTaskAttributes, TaskDetails } from "../../api/tasksApi.types.ts"
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from "../../lib/taskMeta.ts"
import { DeadlinePill, PriorityPill, StatusPill } from "../TaskBadges/TaskBadges.tsx"
import { Attachments } from "./Attachments.tsx"
import { InlineDescription, InlineTitle } from "./InlineEdit.tsx"
import { MoveTaskDialog } from "./MoveTaskDialog.tsx"
import { TaskEditForm } from "./TaskEditForm.tsx"

type Props = {
  isOwner: boolean
}

export const TaskDialog = ({ isOwner }: Props) => {
  const { boardId = "", taskId = "" } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const { data, isLoading, isError, error, refetch } = useGetTaskQuery({ boardId, taskId })

  const close = () => navigate(boardPath(boardId))

  return (
    <Dialog open onClose={close} fullScreen={fullScreen} maxWidth="md" fullWidth aria-labelledby="task-dialog-title">
      <IconButton onClick={close} aria-label="Close task" sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
        <CloseIcon />
      </IconButton>
      {isLoading && <TaskDialogSkeleton />}
      {isError && !data && (
        <Box sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            {isNotFoundError(error) ? "Task not found" : "Couldn’t load the task"}
          </Typography>
          {isNotFoundError(error) ? (
            <Button onClick={close}>Back to board</Button>
          ) : (
            <Button variant="contained" onClick={refetch}>
              Try again
            </Button>
          )}
        </Box>
      )}
      {data && (
        <TaskDetailsView
          key={data.data.id}
          boardId={boardId}
          task={data.data}
          boardTitle={data.included.find((b) => b.id === data.data.relationships.board.data.id)?.attributes.title}
          isOwner={isOwner}
          onClose={close}
        />
      )}
    </Dialog>
  )
}

type DetailsProps = {
  boardId: string
  task: TaskDetails
  boardTitle?: string
  isOwner: boolean
  onClose: () => void
}

const TaskDetailsView = ({ boardId, task, boardTitle, isOwner, onClose }: DetailsProps) => {
  const dispatch = useAppDispatch()
  const [patchTask] = usePatchTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [isMoveOpen, setIsMoveOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { attributes } = task
  const isCompleted = attributes.status === TaskStatus.Completed

  // PATCH — send only the changed attribute
  const patch = (attrs: PatchTaskAttributes) => patchTask({ boardId, taskId: task.id, attributes: attrs })

  const deleteHandler = async () => {
    onClose()
    try {
      await deleteTask({ boardId, taskId: task.id }).unwrap()
      dispatch(showNotificationAC({ message: "Task deleted" }))
    } catch {
      // error is shown by the base query
    }
  }

  return (
    <Box data-testid="task-dialog">
      <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: 3, pb: 2, pr: 8 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          in board <b>{boardTitle ?? "…"}</b>
        </Typography>
        <Box id="task-dialog-title">
          {isEditing ? (
            <Typography variant="h6" component="h2">
              Edit task
            </Typography>
          ) : (
            <InlineTitle value={attributes.title} editable={isOwner} onSave={(title) => patch({ title })} />
          )}
        </Box>
        {!isEditing && (
          <Stack direction="row" spacing={0.75} sx={{ mt: 1.25, flexWrap: "wrap", rowGap: 0.75 }}>
            <StatusPill status={attributes.status} />
            <PriorityPill priority={attributes.priority} />
            {attributes.deadline && <DeadlinePill deadline={attributes.deadline} isDone={isCompleted} />}
          </Stack>
        )}
      </Box>
      <Divider />

      {isEditing ? (
        <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
          <TaskEditForm boardId={boardId} task={task} onDone={() => setIsEditing(false)} />
        </Box>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 260px" } }}>
          <Stack spacing={4} sx={{ p: { xs: 2.5, sm: 4 }, minWidth: 0 }}>
            <InlineDescription
              value={attributes.description}
              editable={isOwner}
              onSave={(description) => patch({ description })}
            />
            <Attachments boardId={boardId} taskId={task.id} attachments={attributes.attachments} isOwner={isOwner} />
          </Stack>

          <Stack
            spacing={2.5}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderLeft: { md: 1 },
              borderTop: { xs: 1, md: 0 },
              borderColor: { xs: "divider", md: "divider" },
              bgcolor: "action.hover",
            }}
          >
            {isOwner ? (
              <>
                <TextField
                  select
                  size="small"
                  label="Status"
                  value={attributes.status}
                  onChange={(e) => patch({ status: Number(e.target.value) as TaskStatus })}
                  slotProps={{ select: { inputProps: { "data-testid": "status-select" } } }}
                >
                  {STATUS_ORDER.map((status) => (
                    <MenuItem key={status} value={status}>
                      {STATUS_META[status].label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Priority"
                  value={attributes.priority}
                  onChange={(e) => patch({ priority: Number(e.target.value) as TaskPriority })}
                >
                  {PRIORITY_ORDER.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {PRIORITY_META[priority].label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="date"
                  size="small"
                  label="Start date"
                  value={toDateInputValue(attributes.startDate)}
                  onChange={(e) => patch({ startDate: fromDateInputValue(e.target.value) })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  type="date"
                  size="small"
                  label="Deadline"
                  value={toDateInputValue(attributes.deadline)}
                  onChange={(e) => patch({ deadline: fromDateInputValue(e.target.value) })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </>
            ) : (
              <>
                <Field label="Status">{STATUS_META[attributes.status].label}</Field>
                <Field label="Priority">{PRIORITY_META[attributes.priority].label}</Field>
                <Field label="Start date">{formatDate(attributes.startDate)}</Field>
                <Field label="Deadline">{formatDate(attributes.deadline)}</Field>
              </>
            )}

            <Box>
              <Field label="Created">{formatDate(attributes.addedAt)}</Field>
              <Field label="Updated">{formatDate(attributes.updatedAt)}</Field>
            </Box>

            {isOwner && (
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<EditNoteIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ justifyContent: "flex-start" }}
                >
                  Edit all fields
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DriveFileMoveOutlinedIcon />}
                  onClick={() => setIsMoveOpen(true)}
                  sx={{ justifyContent: "flex-start" }}
                >
                  Move to board
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => setIsDeleteOpen(true)}
                  sx={{ justifyContent: "flex-start" }}
                >
                  Delete task
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      )}

      <MoveTaskDialog open={isMoveOpen} onClose={() => setIsMoveOpen(false)} boardId={boardId} taskId={task.id} />
      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete task?"
        description={<>“{attributes.title}” and its files will be deleted.</>}
        onConfirm={deleteHandler}
        onClose={() => setIsDeleteOpen(false)}
      />
    </Box>
  )
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 0.5 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {children}
    </Typography>
  </Box>
)

const TaskDialogSkeleton = () => (
  <Box sx={{ p: 4 }}>
    <Skeleton width={120} />
    <Skeleton width="60%" height={40} />
    <Skeleton width={200} />
    <Skeleton variant="rounded" height={160} sx={{ mt: 3 }} />
  </Box>
)
