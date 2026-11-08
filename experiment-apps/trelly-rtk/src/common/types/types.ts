export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

// JSON:API pagination meta
export type JsonApiMeta = {
  page: number
  pageSize: number
  totalCount: number
  pagesCount: number
}

export type JsonApiError = {
  status: string
  code?: unknown
  title?: string
  detail?: string
  source?: { pointer?: string; parameter?: string }
  meta?: Record<string, unknown>
}

export type JsonApiErrorDocument = {
  errors: JsonApiError[]
  meta?: Record<string, unknown>
}

// Query params of every paginated list endpoint (GetPaginatedItemsRequestPayload)
export type PaginationArgs = {
  pageNumber?: number
  pageSize?: number
}

export type ImageSizeType = "original" | "medium" | "thumbnail"

export type ImageVariant = {
  type: ImageSizeType
  width: number
  height: number
  fileSize: number
  url: string
}

// Request body wrapper: { data: { type, attributes } }
export type JsonApiPayload<TType extends string, TAttributes> = {
  data: { type: TType; attributes: TAttributes }
}
