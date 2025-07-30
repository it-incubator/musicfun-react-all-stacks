/**
 * Trims string to maximum length and adds ellipsis if needed.
 *
 * @param {string} str - String to trim
 * @param {number} maxLength - Maximum allowed length (default: 100)
 * @returns {string} Trimmed string with ellipsis if truncated
 *
 * @example
 * trimToMaxLength("Very long text here", 10)
 * // Returns: "Very lo..."
 */
export function trimToMaxLength(str: string, maxLength = 100): string {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str
}
