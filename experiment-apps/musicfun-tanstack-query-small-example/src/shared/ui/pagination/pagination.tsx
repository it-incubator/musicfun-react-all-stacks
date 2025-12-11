import s from './Pagination.module.css'
import { PaginationNav } from './pagination-nav/pagination-nav.tsx'

type Props = {
  current: number
  pagesCount: number
  changePageNumber: (page: number) => void
  isFetching: boolean
}

export const Pagination = ({ current, pagesCount, changePageNumber, isFetching }: Props) => {
  return (
    <div className={s.container}>
      <PaginationNav current={current} pagesCount={pagesCount} onChange={changePageNumber} />{' '}
      {isFetching && '⌛️'}
    </div>
  )
}
