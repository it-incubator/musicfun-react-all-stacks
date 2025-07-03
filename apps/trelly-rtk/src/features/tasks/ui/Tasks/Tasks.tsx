import { TaskStatus } from "@/common/enums"
import type { DomainBoard } from "@/features/boards/api/boardsApi.types.ts"
import { useGetBoardTasksQuery } from "@/features/tasks/api/tasksApi.ts"
import { TasksPagination } from "@/features/tasks/ui/Tasks/TasksPagination/TasksPagination.tsx"
import List from "@mui/material/List"
import { useState } from "react"
import { TaskItem } from "./TaskItem/TaskItem.tsx"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton.tsx"

type Props = {
  board: DomainBoard
}

export const Tasks = ({ board }: Props) => {
  const { id, filter } = board

  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetBoardTasksQuery({ boardId: id, params: { page } })

  let filteredTasks = data?.data
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.attributes.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.attributes.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} board={board} page={page} />)}</List>
          <TasksPagination totalCount={data?.meta.totalCount || 0} page={page} setPage={setPage} />
        </>
      )}
    </>
  )
}
