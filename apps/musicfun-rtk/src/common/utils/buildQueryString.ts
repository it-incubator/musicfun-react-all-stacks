type QueryParamValue = string | number | boolean | (string | number)[] | undefined

/**
 * Builds a query string from parameters object.
 *
 * Skips `undefined` and `null` values.
 * Number values are automatically converted to strings.
 * Arrays are serialized with repeated keys (e.g.: `tagsIds=1&tagsIds=2`).
 *
 * @param {Record<string, QueryParamValue>} params - Object with query parameters
 * @returns {string} Ready query string (e.g.: `key=value&arr=1&arr=2`)
 *
 * @example
 * buildQueryString({ search: 'text', tagsIds: [1, 2], page: 3 })
 * // Returns: "search=text&tagsIds=1&tagsIds=2&page=3"
 */

export function buildQueryString(params: Record<string, QueryParamValue>): string {
  const searchParams = new URLSearchParams()
  for (const key in params) {
    const value = params[key]
    if (value === undefined || value === null) continue

    // If it's an array, add each element separately (e.g.: tagsIds=1&tagsIds=2)
    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (val !== undefined && val !== null) searchParams.append(key, String(val))
      })
    } else {
      searchParams.append(key, String(value))
    }
  }
  return searchParams.toString()
}
