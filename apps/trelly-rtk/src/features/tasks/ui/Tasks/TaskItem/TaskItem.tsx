import { EditableSpan } from "@/common/components"
import { TaskStatus } from "@/common/enums"
import type { DomainBoard } from "@/features/boards/api/boardsApi.types.ts"
import { createTaskModel } from "@/features/boards/lib/utils"
import { useRemoveTaskMutation, useUpdateTaskMutation } from "@/features/tasks/api/tasksApi.ts"
import type { Task } from "@/features/tasks/api/tasksApi.types.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles.ts"

type Props = {
  task: Task
  board: DomainBoard
  page: number
}

export const TaskItem = ({ task, board, page }: Props) => {
  const [removeTask] = useRemoveTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const deleteTask = () => {
    removeTask({ boardId: board.id, taskId: task.id })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createTaskModel(task, { status })
    updateTask({ taskId: task.id, boardId: board.id, model, page })
  }

  const changeTaskTitle = (title: string) => {
    const model = createTaskModel(task, { title })
    updateTask({ taskId: task.id, boardId: board.id, model, page })
  }

  const isTaskCompleted = task.attributes.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} />
        <EditableSpan value={task.attributes.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
