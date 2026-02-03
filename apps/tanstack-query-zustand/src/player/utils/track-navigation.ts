import type { RepeatMode } from '../types/player.types'

/**
 * Утилита для вычисления ID следующего трека в очереди
 */
export function getNextTrackId(
  queue: string[],
  queueIndex: number,
  repeatMode: RepeatMode
): string | null {
  if (queue.length === 0) return null

  const isAtEnd = queueIndex >= queue.length - 1

  if (isAtEnd) {
    if (repeatMode === 'one') return queue[queueIndex]
    if (repeatMode === 'all') return queue[0]
    return null
  }

  return queue[queueIndex + 1]
}

/**
 * Утилита для вычисления ID предыдущего трека в очереди
 */
export function getPreviousTrackId(
  queue: string[],
  queueIndex: number,
  repeatMode: RepeatMode
): string | null {
  if (queue.length === 0) return null

  const isAtBeginning = queueIndex <= 0

  if (isAtBeginning) {
    if (repeatMode === 'all') return queue[queue.length - 1]
    return queue[0]
  }

  return queue[queueIndex - 1]
}

/**
 * Утилита для вычисления позиции в очереди
 */
export function getQueuePosition(queueIndex: number, queueLength: number) {
  return {
    current: queueIndex + 1,
    total: queueLength,
    isFirst: queueIndex === 0,
    isLast: queueIndex >= queueLength - 1,
  }
}
