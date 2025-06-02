import { getPaginationPages } from "@/common/utils"
import s from "./Pagination.module.css"

type Props = {
  current: number
  pagesCount: number
  pageSize: number
  changePageNumber: (page: number) => void
  changePageSize: (size: number) => void
}

const SIBLING_COUNT = 1

export const Pagination = ({ current, pagesCount, pageSize, changePageNumber, changePageSize }: Props) => {
  if (pagesCount <= 1) return null

  const pages = getPaginationPages(current, pagesCount, SIBLING_COUNT)

  return (
    <div className={s.container}>
      <div className={s.pagination}>
        {pages.map((item, idx) =>
          item === "..." ? (
            <span className={s.ellipsis} key={`ellipsis-${idx}`}>
              ...
            </span>
          ) : (
            <button
              key={item}
              className={item === current ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton}
              onClick={() => item !== current && changePageNumber(Number(item))}
              disabled={item === current}
              type="button"
            >
              {item}
            </button>
          ),
        )}
      </div>

      <label>
        Показать
        <select value={pageSize} onChange={(e) => changePageSize(Number(e.target.value))}>
          {[2, 4, 8, 16, 32].map((size) => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </select>
        на странице
      </label>
    </div>
  )
}
