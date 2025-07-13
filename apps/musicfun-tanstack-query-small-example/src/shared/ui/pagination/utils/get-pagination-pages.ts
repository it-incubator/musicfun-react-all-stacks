/**
 * Генерирует массив страниц для отображения пагинации с учётом троеточий
 */
export const getPaginationPages = (current: number, pagesCount: number, siblingCount: number): (number | '...')[] => {
  if (pagesCount <= 1) return []

  const pages: (number | '...')[] = []

  // Границы диапазона вокруг текущей страницы
  const leftSibling = Math.max(2, current - siblingCount)
  const rightSibling = Math.min(pagesCount - 1, current + siblingCount)

  // Всегда показываем первую страницу
  pages.push(1)

  // Троеточие слева
  if (leftSibling > 2) {
    pages.push('...')
  }

  // Соседние страницы вокруг текущей
  for (let page = leftSibling; page <= rightSibling; page++) {
    pages.push(page)
  }

  // Троеточие справа
  if (rightSibling < pagesCount - 1) {
    pages.push('...')
  }

  // Всегда показываем последнюю страницу (если больше одной)
  if (pagesCount > 1) {
    pages.push(pagesCount)
  }

  return pages
}
