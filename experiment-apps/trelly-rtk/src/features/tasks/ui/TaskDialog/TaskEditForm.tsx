import { zodResolver } from "@hookform/resolvers/zod"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Controller, useForm } from "react-hook-form"

import { showNotificationAC } from "@/app/model/app-slice.ts"
import { LIMITS } from "@/common/constants"
import { useAppDispatch } from "@/common/hooks"
import { fromDateInputValue, toDateInputValue } from "@/common/utils"

import { useReplaceTaskMutation } from "../../api/tasksApi.ts"
import type { TaskDetails } from "../../api/tasksApi.types.ts"
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from "../../lib/taskMeta.ts"
import { type TaskInputs, taskSchema } from "../../lib/taskSchema.ts"

type Props = {
  boardId: string
  task: TaskDetails
  onDone: () => void
}

/** Edits every attribute at once and saves them with PUT (full replacement) */
export const TaskEditForm = ({ boardId, task, onDone }: Props) => {
  const dispatch = useAppDispatch()
  const [replaceTask, { isLoading }] = useReplaceTaskMutation()
  const { attributes } = task

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskInputs>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: attributes.title,
      description: attributes.description ?? "",
      status: attributes.status,
      priority: attributes.priority,
      startDate: toDateInputValue(attributes.startDate),
      deadline: toDateInputValue(attributes.deadline),
    },
  })

  const onSubmit = async (values: TaskInputs) => {
    try {
      await replaceTask({
        boardId,
        taskId: task.id,
        attributes: {
          title: values.title,
          description: values.description.trim() || null,
          status: values.status,
          priority: values.priority,
          startDate: fromDateInputValue(values.startDate),
          deadline: fromDateInputValue(values.deadline),
        },
      }).unwrap()
      dispatch(showNotificationAC({ message: "Task saved" }))
      onDone()
    } catch {
      // error is shown by the base query
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate data-testid="task-edit-form">
      <Stack spacing={2.5}>
        <TextField
          label="Title"
          required
          fullWidth
          autoFocus
          error={!!errors.title}
          helperText={errors.title?.message}
          slotProps={{ htmlInput: { maxLength: LIMITS.titleMaxLength } }}
          {...register("title")}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={4}
          maxRows={14}
          error={!!errors.description}
          helperText={errors.description?.message ?? `${watch("description").length}/${LIMITS.descriptionMaxLength}`}
          {...register("description")}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField select label="Status" fullWidth {...field}>
                {STATUS_ORDER.map((status) => (
                  <MenuItem key={status} value={status}>
                    {STATUS_META[status].label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField select label="Priority" fullWidth {...field}>
                {PRIORITY_ORDER.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {PRIORITY_META[priority].label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Start date"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("startDate")}
          />
          <TextField
            label="Deadline"
            type="date"
            fullWidth
            error={!!errors.deadline}
            helperText={errors.deadline?.message}
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("deadline")}
          />
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={onDone} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Save changes
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
