import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'

type Props = {
  id: string
  children: ReactNode
}

export const SortableItem = ({ id, children }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={'flex-container'}
        {...listeners}
        style={{ cursor: 'grab', marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}
      >
        <div>☰</div>
      </div>
      <div>{children}</div>
    </div>
  )
}
