// Type for API track (union of different formats)
import type { components } from '@/shared/api/schema.ts'

export type ApiTrack =
  | components['schemas']['TrackListItemResource']
  | components['schemas']['TrackDetailsResource']
