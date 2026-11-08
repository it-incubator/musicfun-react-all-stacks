import { useOutletContext } from "react-router"

import { TaskDialog } from "@/features/tasks/ui/TaskDialog/TaskDialog.tsx"

import type { BoardOutletContext } from "./BoardPage.tsx"

export const TaskRoute = () => {
  const { isOwner } = useOutletContext<BoardOutletContext>()
  return <TaskDialog isOwner={isOwner} />
}
