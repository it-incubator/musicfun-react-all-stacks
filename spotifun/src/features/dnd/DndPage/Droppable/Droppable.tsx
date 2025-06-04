import { useDroppable } from "@dnd-kit/core"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  id: string
}

export const Droppable = ({ children, id }: Props) => {
  const { isOver, setNodeRef } = useDroppable({ id })

  const style = { color: isOver ? "green" : undefined }

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  )
}
