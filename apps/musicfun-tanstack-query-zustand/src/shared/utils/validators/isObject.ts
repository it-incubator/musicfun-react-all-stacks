import isArray from './isArray'
import isNull from './isNull'

/**
 * Type predicate that checks whether a value is a plain object (non-null, non-array object).
 *
 * Returns `true` for:
 * - Object literals: `{}`, `{ foo: 'bar' }`
 * - Objects created with `new Object()`
 * - Objects created with `Object.create(null)` or `Object.create({})`
 * - Class instances (since they are objects too)
 *
 * Returns `false` for:
 * - `null`
 * - Arrays
 * - Functions
 * - Primitives (`string`, `number`, `boolean`, etc.)
 * - DOM nodes, Dates, RegExp, Map, Set, etc. (they are objects but not "plain")
 *
 * @param value - The value to check
 * @returns `true` if the value is a plain object, `false` otherwise
 *
 * @template T - The shape of the object (defaults to `Record<string, any>`)
 *
 * @example
 * ```ts
 * if (isObject(maybeObj)) {
 *   Object.keys(maybeObj).forEach(key => {
 *     console.log(maybeObj[key]) // fully typed access
 *   })
 * }
 *
 * declare const input: unknown
 * if (isObject<{ name: string }>(input)) {
 *   console.log(input.name.toUpperCase()) // TS knows `name` exists and is string
 * }
 *
 * isObject({})              // true
 * isObject([])              // false
 * isObject(null)            // false
 * isObject(new Date())      // false
 * isObject(() => {})        // false
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject<T extends Record<string, any>>(value: any): value is T {
  return typeof value === 'object' && !isArray(value) && !isNull(value)
}

export default isObject
