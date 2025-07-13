import clsx from 'clsx'

import { Typography } from '@/shared/components/Typography/Typography'

import s from './ContentList.module.css'

type ContentListProps<T> = {
  title?: string
  data: T[] | undefined
  renderItem: (item: T) => React.ReactNode
  listClassName?: string
  isLoading: boolean
  skeleton: React.ReactNode
}

export const ContentList = <T,>({
  title,
  data = [],
  renderItem,
  listClassName,
  isLoading,
  skeleton,
}: ContentListProps<T>) => {
  return (
    <section>
      {title && (
        <Typography variant="h2" className={s.title}>
          {title}
        </Typography>
      )}
      <ul className={clsx(s.list, listClassName)}>
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <li key={i}>{skeleton}</li>)
          : data.map((item, index) => <li key={index}>{renderItem(item)}</li>)}
      </ul>
    </section>
  )
}
