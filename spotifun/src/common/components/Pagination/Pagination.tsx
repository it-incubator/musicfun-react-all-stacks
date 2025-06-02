import { getPaginationPages } from "@/common/utils"
import s from "./Pagination.module.css"

type Props = {
  current: number
  pagesCount: number
  onChange: (page: number) => void
}

const SIBLING_COUNT = 1

export const Pagination = ({ current, pagesCount, onChange }: Props) => {
  if (pagesCount <= 1) return null

  const pages = getPaginationPages(current, pagesCount, SIBLING_COUNT)

  return (
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
            onClick={() => item !== current && onChange(Number(item))}
            disabled={item === current}
            type="button"
          >
            {item}
          </button>
        ),
      )}
    </div>
  )
}
