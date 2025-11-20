/**
 * Fisher-Yates shuffle algorithm
 * Shuffles an array in place and returns it
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

/**
 * Shuffles an array but keeps the current item at its position
 * Useful when enabling shuffle mode while a track is playing
 */
export function shuffleWithCurrentItem<T>(array: T[], currentIndex: number): T[] {
  if (currentIndex < 0 || currentIndex >= array.length) {
    return shuffle(array)
  }

  const currentItem = array[currentIndex]
  const otherItems = array.filter((_, index) => index !== currentIndex)
  const shuffledOthers = shuffle(otherItems)

  // Insert current item at the beginning
  return [currentItem, ...shuffledOthers]
}
