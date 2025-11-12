export function trimToMaxLength(str: string, maxLength = 100): string {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str
}
