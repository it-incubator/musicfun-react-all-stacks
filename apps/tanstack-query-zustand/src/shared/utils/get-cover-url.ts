import type { components } from '@/shared/api/schema.ts'
import { getImageByType } from '@/shared/utils/get-image-by-type.ts'

/**
 * Gets track cover image
 */
export const getCoverUrl = (
  images:
    | components['schemas']['TrackImages']
    | components['schemas']['PlaylistImagesOutputDTO']
    | undefined
): string => {
  // Try to get medium-sized image
  const mediumImage = getImageByType(images, 'medium')
  if (mediumImage) return mediumImage.url

  // If no medium, use original
  const originalImage = getImageByType(images, 'original')
  if (originalImage) return originalImage.url

  // If no original, use first available
  const firstImage = getImageByType(images, '')
  return firstImage?.url || ''
}
