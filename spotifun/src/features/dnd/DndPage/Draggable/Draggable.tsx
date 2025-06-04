import { useDraggable } from "@dnd-kit/core"
import type { ReactNode } from "react"
import { CSS } from "@dnd-kit/utilities"

type Props = {
  children: ReactNode
  id: string
}

export const Draggable = ({ children, id }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

  const style = { transform: CSS.Translate.toString(transform) }

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  )
}
