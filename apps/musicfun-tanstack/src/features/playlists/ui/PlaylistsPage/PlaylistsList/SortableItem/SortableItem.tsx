import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  id: string
  title: string
  children: ReactNode
}

export const SortableItem = ({ id, children, title }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={'flex-container'} {...listeners} style={{ cursor: 'grab', marginBottom: '16px' }}>
        <div>
          <b>title:</b> <span>{title}</span>
        </div>
        <div>☰</div>
      </div>
      <div>{children}</div>
    </div>
  )
}
