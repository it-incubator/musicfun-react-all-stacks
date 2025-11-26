import getType from './getType'

/**
 * Type predicate that checks whether a value is an array.
 *
 * Uses `Object.prototype.toString.call()` internally (via `getType`) — the most reliable
 * way to detect arrays in JavaScript, immune to cross-realm issues and `Array.isArray`
 * polyfills problems in older environments.
 *
 * @param value - The value to check
 * @returns `true` if the value is an array, `false` otherwise
 *
 * @template T - The type of array elements (defaults to `any` if not specified)
 *
 * @example
 * ```ts
 * if (isArray(maybeArray)) {
 *   console.log(maybeArray.length) // TypeScript knows it's an array
 *   maybeArray.push(123)           // fully typed
 * }
 *
 * declare const data: string | number[] | null
 * if (isArray(data)) {
 *   data.push(42) // TS knows: data is number[]
 * }
 *
 * // With explicit generic:
 * if (isArray<string>(value)) {
 *   value.map(s => s.toUpperCase()) // TS knows elements are strings
 * }
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArray<T>(value: any): value is T[] {
  return getType(value) === '[object Array]'
}

export default isArray
