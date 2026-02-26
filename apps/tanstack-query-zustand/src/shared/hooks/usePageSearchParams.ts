import { useSearchParams } from 'react-router'
import { useDebounceValue } from './index'

export const usePageSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const [debouncedSearch] = useDebounceValue(search, 500)

  const sortBy = searchParams.get('sortBy') || 'addedAt'
  const sortDirection = (searchParams.get('sortDirection') as 'asc' | 'desc') || 'desc'
  const tagsIds = searchParams.get('tags')?.split(',').filter(Boolean) || []
  const artistsIds = searchParams.get('artists')?.split(',').filter(Boolean) || []

  const pageNumber = Number(searchParams.get('page')) || 1

  const updateSearchParams = (updates: Record<string, string | string[] | number | undefined>) => {
    setSearchParams((prev) => {
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
          prev.delete(key)
        } else if (Array.isArray(value)) {
          prev.set(key, value.join(','))
        } else {
          prev.set(key, value.toString())
        }
      })

      // Reset page to 1 if anything other than page changed
      if (
        !updates.page &&
        (updates.search !== undefined || updates.sortBy || updates.tags || updates.artists)
      ) {
        prev.delete('page')
      }

      return prev
    })
  }

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page === 1 ? undefined : page })
  }

  const handleSearchChange = (value: string) => {
    updateSearchParams({ search: value })
  }

  const handleSortChange = (sortBy: string, sortDirection: string) => {
    updateSearchParams({ sortBy, sortDirection })
  }

  const handleTagsChange = (tags: string[]) => {
    updateSearchParams({ tags })
  }

  const handleArtistsChange = (artists: string[]) => {
    updateSearchParams({ artists })
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
    handleSearchChange,
    handleSortChange,
    handleTagsChange,
    handleArtistsChange,
  }
}
