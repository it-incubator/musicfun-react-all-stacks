import { PageSizeSelect } from './PageSizeSelect/PageSizeSelect.tsx'
import { PaginationNav } from './PaginationNav/PaginationNav.tsx'
import s from './Pagination.module.css'

type Props = {
  current: number
  pagesCount: number
  pageSize: number
  changePageNumber: (page: number) => void
  changePageSize: (size: number) => void
}

export const Pagination = ({ current, pagesCount, pageSize, changePageNumber, changePageSize }: Props) => {
  return (
    <div className={s.container}>
      <PaginationNav current={current} pagesCount={pagesCount} onChange={changePageNumber} />
      <PageSizeSelect pageSize={pageSize} onChange={changePageSize} />
    </div>
  )
}
