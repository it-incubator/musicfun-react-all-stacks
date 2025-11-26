import getType from './getType'

/**
 * Type predicate that checks whether a value is exactly `undefined`.
 *
 * This is a more explicit and type-safe alternative to `value === undefined`
 * when you need TypeScript to properly narrow the type in conditional blocks.
 *
 * Uses `Object.prototype.toString.call()` internally for maximum reliability
 * (works correctly even in cross-realm environments).
 *
 * @param value - The value to check
 * @returns `true` if the value is `undefined`, `false` otherwise
 *
 * @example
 * ```ts
 * if (isUndefined(maybeValue)) {
 *   // TypeScript knows the type is `undefined` here
 *   console.log('Value is missing')
 * }
 *
 * declare const config: { timeout?: number }
 * if (isUndefined(config.timeout)) {
 *   config.timeout // TypeScript narrows to undefined
 * }
 *
 * isUndefined(undefined)     // true
 * isUndefined(void 0)         // true
 * isUndefined(null)           // false
 * isUndefined('')             // false
 * ```
 */

function isUndefined(value: unknown): value is undefined {
  return getType(value) === '[object Undefined]'
}

export default isUndefined
