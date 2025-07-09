import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon } from '@/shared/icons'

import { IconButton } from '../IconButton'
import s from './Pagination.module.css'

export type PaginationProps = {
  page: number
  pagesCount: number
  onPageChange: (page: number) => void
  className?: string
} & Omit<ComponentProps<'div'>, 'children'>

const MAX_VISIBLE_PAGES = 5

export const Pagination = ({
  page,

  pagesCount,
  onPageChange,
  className,
  ...props
}: PaginationProps) => {
  // Helper function to generate page numbers array
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []

    if (pagesCount <= MAX_VISIBLE_PAGES) {
      // Show all pages if total is small
      for (let i = 1; i <= pagesCount; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (page > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, page - 1)
      const end = Math.min(pagesCount - 1, page + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== pagesCount) {
          pages.push(i)
        }
      }

      if (page < pagesCount - 2) {
        pages.push('ellipsis')
      }

      // Always show last page if it's not already included
      if (pagesCount > 1) {
        pages.push(pagesCount)
      }
    }

    return pages
  }

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (page < pagesCount) {
      onPageChange(page + 1)
    }
  }

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber)
  }

  if (pagesCount <= 1) {
    return null
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div
      className={clsx(s.pagination, className)}
      role="navigation"
      aria-label="Pagination"
      {...props}>
      {/* Previous button */}
      <IconButton
        onClick={handlePrevious}
        disabled={page === 1}
        aria-label="Go to previous page"
        className={s.navButton}>
        <KeyboardArrowLeftIcon />
      </IconButton>

      {/* Page numbers */}
      <div className={s.pageNumbers}>
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className={s.ellipsis} aria-hidden="true">
                ...
              </span>
            )
          }

          const isActive = pageNumber === page

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={clsx(s.pageButton, isActive && s.active)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
              type="button">
              {pageNumber}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      <IconButton
        onClick={handleNext}
        disabled={page === pagesCount}
        aria-label="Go to next page"
        className={s.navButton}>
        <KeyboardArrowRightIcon />
      </IconButton>
    </div>
  )
}
