export type Nullable<T> = T | null

export type Meta = {
  page: number
  pageSize: number
  totalCount: number
  pagesCount: number
}

export type ExtensionsError = {
  data: {
    extensions?: { key?: string; message?: string }[]
  }
}

export type SortDirection = 'asc' | 'desc'

export type SortBy = 'addedAt' | 'likesCount'
