import AddIcon from "@mui/icons-material/Add"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import { type FormEvent, useState } from "react"

import { LIMITS } from "@/common/constants"

import { useCreateTaskMutation } from "../../api/tasksApi.ts"

type Props = {
  boardId: string
  tasksCount: number
}

export const AddTaskForm = ({ boardId, tasksCount }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [createTask, { isLoading }] = useCreateTaskMutation()

  const isFull = tasksCount >= LIMITS.tasksPerBoard

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError("Title is required")
      return
    }
    try {
      await createTask({ boardId, title: trimmed }).unwrap()
      setTitle("")
    } catch {
      // error is shown by the base query
    }
  }

  const helperText = error ?? (isFull ? `A board holds at most ${LIMITS.tasksPerBoard} tasks` : undefined)

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: "flex", gap: 1, alignItems: "flex-start", maxWidth: 820 }}>
      <TextField
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          setError(null)
        }}
        placeholder={isFull ? "This board is full" : "Add a task…"}
        size="small"
        fullWidth
        disabled={isFull}
        error={!!error}
        helperText={helperText}
        slotProps={{
          htmlInput: { maxLength: LIMITS.titleMaxLength, "aria-label": "New task title" },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <AddIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.paper" } }}
      />
      <Button type="submit" variant="contained" disabled={isFull || isLoading} sx={{ height: 40, flexShrink: 0 }}>
        Add task
      </Button>
    </Box>
  )
}
