import { useSearchParams } from 'react-router'

import { useDebounce } from '@/shared/hooks'

export const usePageSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const debouncedSearch = useDebounce(search, 500)

  const sortBy = searchParams.get('sortBy') as 'addedAt' | 'likesCount'
  const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc'
  const tagsIds = searchParams.get('tags')?.split(',').filter(Boolean) || []
  const artistsIds = searchParams.get('artists')?.split(',').filter(Boolean) || []

  const pageNumber = Number(searchParams.get('page')) || 1

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      if (page === 1) {
        prev.delete('page')
      } else {
        prev.set('page', page.toString())
      }
      return prev
    })
  }

  return {
    search,
    debouncedSearch,
    sortBy,
    sortDirection,
    tagsIds,
    artistsIds,
    pageNumber,
    handlePageChange,
  }
}
