import type { components } from '@/shared/api/schema.ts'

/**
 * Extracts audio URL from track attachments
 */
export const getAudioUrl = (
  attachments: components['schemas']['TrackAttachment'][] | undefined
): string => {
  if (!attachments || attachments.length === 0) return ''

  // Search for audio file in attachments
  const audioAttachment = attachments.find(
    (att) =>
      att.contentType?.startsWith('audio/') ||
      att.originalName?.toLowerCase().match(/\.(mp3|wav|ogg|m4a)$/)
  )

  return audioAttachment?.url || ''
}
