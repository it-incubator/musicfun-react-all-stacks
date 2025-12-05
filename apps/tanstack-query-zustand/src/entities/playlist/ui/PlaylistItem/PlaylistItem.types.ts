import type { components } from '@/shared/api/schema.ts'

// duplication of the CurrentUserReaction type to decouple the shared layer from the features layer
export type CurrentUserReaction = components['schemas']['ReactionValue']

export interface PlaylistItemProps {
  playlist: components['schemas']['PlaylistListItemJsonApiData']
}
