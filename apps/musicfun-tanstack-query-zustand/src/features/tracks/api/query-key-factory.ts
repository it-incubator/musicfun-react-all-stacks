import type { SchemaGetTracksRequestPayload } from '@/shared/api/schema'

export const tracksKeys = {
  all: ['tracks'] as const,
  lists: () => [...tracksKeys.all, 'list'] as const,
  list: (filters: SchemaGetTracksRequestPayload) =>
    [...tracksKeys.lists(), filters] as const,
  details: () => [...tracksKeys.all, 'detail'] as const,
  detail: (id: string) => [...tracksKeys.details(), id] as const,
}
