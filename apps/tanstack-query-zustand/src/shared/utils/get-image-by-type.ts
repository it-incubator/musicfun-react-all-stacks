import type { components } from '@/shared/api/schema.ts'

/**
 * Gets image of specific type from images array
 */
export const getImageByType = (
  images:
    | components['schemas']['TrackImages']
    | components['schemas']['PlaylistImagesOutputDTO']
    | undefined,
  preferredType: string
): components['schemas']['ImageVariant'] | undefined => {
  if (!images?.main) return undefined

  // Search image by type
  const imageByType = images.main.find((img) => img.type === preferredType)
  if (imageByType) return imageByType

  // If not found, return first available
  return images.main[0]
}
