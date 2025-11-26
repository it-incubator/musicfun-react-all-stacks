import isNull from './isNull'
import isUndefined from './isUndefined'

/**
 * Type predicate that checks whether a value is neither `null` nor `undefined`.
 *
 * Useful for filtering out optional (`T | null | undefined`) values and narrowing
 * the type to the non-nullable `T` in conditional blocks, `if`, `Array.filter()`, etc.
 *
 * @param value - The value that might be `T`, `null`, or `undefined`
 * @returns `true` if the value is present and valid (i.e. not `null` and not `undefined`)
 *
 * @template T - The expected type when the value is present
 *
 * @example
 * ```ts
 * declare const maybeString: string | null | undefined
 *
 * if (isValid(maybeString)) {
 *   maybeString.toUpperCase() // TypeScript knows it's `string`
 * }
 *
 * const items: (User | null | undefined)[] = [...]
 * const validItems = items.filter(isValid) // User[]
 *
 * isValid(42)          // true
 * isValid('hello')     // true
 * isValid(null)        // false
 * isValid(undefined)   // false
 * ```
 */

function isValid<T>(value: T | null | undefined): value is T {
  return !isNull(value) && !isUndefined(value)
}

export default isValid
