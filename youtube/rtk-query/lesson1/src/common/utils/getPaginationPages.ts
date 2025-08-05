const SIBLING_COUNT = 1

/**
 * Generates an array of pages for pagination display with ellipses
 */
export const getPaginationPages = (currentPage: number, pagesCount: number): (number | '...')[] => {
  if (pagesCount <= 1) return []

  const pages: (number | '...')[] = []

  // Range boundaries around the current page
  const leftSibling = Math.max(2, currentPage - SIBLING_COUNT)
  const rightSibling = Math.min(pagesCount - 1, currentPage + SIBLING_COUNT)

  // Always show the first page
  pages.push(1)

  // Ellipsis on the left
  if (leftSibling > 2) {
    pages.push('...')
  }

  // Neighboring pages around the current page
  for (let page = leftSibling; page <= rightSibling; page++) {
    pages.push(page)
  }

  // Ellipsis on the right
  if (rightSibling < pagesCount - 1) {
    pages.push('...')
  }

  // Always show the last page (if more than one)
  if (pagesCount > 1) {
    pages.push(pagesCount)
  }

  return pages
}
