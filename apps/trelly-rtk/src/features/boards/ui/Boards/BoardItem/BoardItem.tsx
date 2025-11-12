import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm.tsx"
import type { DomainBoard } from "@/features/boards/api/boardsApi.types.ts"
import { FilterButtons } from "@/features/boards/ui/Boards/BoardItem/FilterButtons/FilterButtons.tsx"
import { useAddTaskMutation } from "@/features/tasks/api/tasksApi.ts"
import { Tasks } from "../../../../tasks/ui/Tasks/Tasks.tsx"
import { BoardTitle } from "@/features/boards/ui/Boards/BoardItem/BoardTitle/BoardTitle.tsx"

type Props = {
  board: DomainBoard
}

export const BoardItem = ({ board }: Props) => {
  const [mutation] = useAddTaskMutation()

  const createTask = (title: string) => mutation({ boardId: board.id, title })

  return (
    <>
      <BoardTitle board={board} />
      <CreateItemForm onCreateItem={createTask} />
      <Tasks board={board} />
      <FilterButtons board={board} />
    </>
  )
}
