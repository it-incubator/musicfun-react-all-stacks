import clsx from 'clsx'

import { Typography } from '@/shared/components/Typography/Typography.tsx'

import s from './ContentList.module.css'

type ContentListProps<T> = {
  title?: string
  data: T[] | undefined
  renderItem: (item: T) => React.ReactNode
  listClassName?: string
  isLoading?: boolean
  skeleton?: React.ReactNode
  emptyMessage?: string
}

const SKELETON_ITEM_COUNT = 10

export const ContentList = <T,>({
  title,
  data = [],
  renderItem,
  listClassName,
  isLoading,
  skeleton,
  emptyMessage,
}: ContentListProps<T>) => {
  if (data?.length === 0 && !isLoading) {
    return <Typography variant="body2">{emptyMessage}</Typography>
  }

  return (
    <section>
      {title && (
        <Typography variant="h2" className={s.title}>
          {title}
        </Typography>
      )}
      <ul className={clsx(s.list, listClassName)}>
        {isLoading
          ? Array.from({ length: SKELETON_ITEM_COUNT }).map((_, i) => <li key={i}>{skeleton}</li>)
          : data.map((item, index) => <li key={index}>{renderItem(item)}</li>)}
      </ul>
    </section>
  )
}
