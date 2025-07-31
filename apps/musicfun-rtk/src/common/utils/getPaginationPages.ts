/**
 * Generates an array of pages for pagination display with ellipsis.
 *
 * Creates a smart pagination array that always includes first and last pages,
 * with ellipsis (...) for gaps between visible page ranges.
 *
 * @param {number} current - Current active page number
 * @param {number} pagesCount - Total number of pages available
 * @param {number} siblingCount - Number of pages to show around current page
 * @returns {(number | '...')[]} Array of page numbers and ellipsis strings
 *
 * @example
 * getPaginationPages(5, 10, 1)
 * // Returns: [1, '...', 4, 5, 6, '...', 10]
 */
export const getPaginationPages = (current: number, pagesCount: number, siblingCount: number): (number | '...')[] => {
  if (pagesCount <= 1) return []

  const pages: (number | '...')[] = []

  // Range boundaries around current page
  const leftSibling = Math.max(2, current - siblingCount)
  const rightSibling = Math.min(pagesCount - 1, current + siblingCount)

  // Always show first page
  pages.push(1)

  // Left ellipsis
  if (leftSibling > 2) {
    pages.push('...')
  }

  // Adjacent pages around current
  for (let page = leftSibling; page <= rightSibling; page++) {
    pages.push(page)
  }

  // Right ellipsis
  if (rightSibling < pagesCount - 1) {
    pages.push('...')
  }

  // Always show last page (if more than one)
  if (pagesCount > 1) {
    pages.push(pagesCount)
  }

  return pages
}
