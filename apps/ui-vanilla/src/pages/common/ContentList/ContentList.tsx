import clsx from 'clsx'

import { Typography } from '@/shared/components/Typography/Typography'

import s from './ContentList.module.css'

type ContentListProps<T> = {
  title?: string
  data: T[]
  renderItem: (item: T) => React.ReactNode
  listClassName?: string
}

export const ContentList = <T,>({
  title,
  data,
  renderItem,
  listClassName,
}: ContentListProps<T>) => {
  return (
    <section>
      {title && (
        <Typography variant="h2" className={s.title}>
          {title}
        </Typography>
      )}
      <ul className={clsx(s.list, listClassName)}>
        {data.map((item, index) => (
          <li key={index}>{renderItem(item)}</li>
        ))}
      </ul>
    </section>
  )
}
