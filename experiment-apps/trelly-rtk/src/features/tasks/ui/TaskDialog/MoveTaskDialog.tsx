import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControlLabel from "@mui/material/FormControlLabel"
import MenuItem from "@mui/material/MenuItem"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useNavigate } from "react-router"

import { showNotificationAC } from "@/app/model/app-slice.ts"
import { LIMITS } from "@/common/constants"
import { useAppDispatch } from "@/common/hooks"
import { taskPath } from "@/common/routing"
import { useGetMyBoardsQuery } from "@/features/boards/api/boardsApi.ts"

import { BOARD_TASKS_ARGS, useGetBoardTasksQuery, useMoveTaskMutation } from "../../api/tasksApi.ts"

type Props = {
  open: boolean
  onClose: () => void
  boardId: string
  taskId: string
}

export const MoveTaskDialog = ({ open, onClose, boardId, taskId }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    {open && <MoveTaskForm onClose={onClose} boardId={boardId} taskId={taskId} />}
  </Dialog>
)

const MoveTaskForm = ({ onClose, boardId, taskId }: Omit<Props, "open">) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: myBoards } = useGetMyBoardsQuery()
  const [moveTask, { isLoading }] = useMoveTaskMutation()

  const targets = myBoards?.data.filter((b) => b.id !== boardId) ?? []
  const [targetBoardId, setTargetBoardId] = useState("")
  const [position, setPosition] = useState<"top" | "bottom">("top")

  // the last task of the target board is needed to put the task at the bottom
  const { data: targetTasks, isFetching } = useGetBoardTasksQuery(BOARD_TASKS_ARGS(targetBoardId), {
    skip: !targetBoardId,
  })
  const isTargetFull = (targetTasks?.meta.totalCount ?? 0) >= LIMITS.tasksPerBoard

  const onSubmit = async () => {
    const lastTask = targetTasks?.data[targetTasks.data.length - 1]
    const putAfterItemId = position === "bottom" && lastTask ? lastTask.id : null
    try {
      await moveTask({ boardId, taskId, targetBoardId, putAfterItemId }).unwrap()
      const title = targets.find((b) => b.id === targetBoardId)?.attributes.title
      dispatch(showNotificationAC({ message: `Task moved to “${title}”` }))
      onClose()
      navigate(taskPath(targetBoardId, taskId), { replace: true })
    } catch {
      // error is shown by the base query
    }
  }

  return (
    <>
      <DialogTitle>Move task</DialogTitle>
      <DialogContent>
        {targets.length === 0 ? (
          <Typography color="text.secondary">Create another board first to move tasks between boards.</Typography>
        ) : (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              select
              label="Target board"
              value={targetBoardId}
              onChange={(e) => setTargetBoardId(e.target.value)}
              fullWidth
              error={isTargetFull}
              helperText={isTargetFull ? `This board already has ${LIMITS.tasksPerBoard} tasks` : undefined}
            >
              {targets.map((board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.attributes.title}
                </MenuItem>
              ))}
            </TextField>
            <RadioGroup row value={position} onChange={(e) => setPosition(e.target.value as "top" | "bottom")}>
              <FormControlLabel value="top" control={<Radio />} label="To the top" />
              <FormControlLabel value="bottom" control={<Radio />} label="To the bottom" />
            </RadioGroup>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!targetBoardId || isFetching || isTargetFull || isLoading}
        >
          Move
        </Button>
      </DialogActions>
    </>
  )
}
