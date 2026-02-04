/**
 * Formats seconds into MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${padZero(minutes)}:${padZero(secs)}`
  }

  return `${minutes}:${padZero(secs)}`
}

/**
 * Pads a number with leading zero if less than 10
 */
function padZero(num: number): string {
  return num.toString().padStart(2, '0')
}

/**
 * Parses a time string (MM:SS or HH:MM:SS) into seconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':').map(Number)

  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }

  return 0
}
