// Type for API track (union of different formats)
import type { components } from '@/shared/api/schema.ts'

export type ApiTrackTypes =
  | components['schemas']['TrackListItemOutput']
  | components['schemas']['TrackDetailsData']
