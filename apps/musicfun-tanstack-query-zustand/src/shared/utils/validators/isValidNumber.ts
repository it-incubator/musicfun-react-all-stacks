import isNaN from './inNun'
import isNumber from './isNumber'

/**
 * Type predicate that checks whether a value is a valid, finite number.
 *
 * Returns `true` only for actual numbers that are **not** `NaN` and **not** `±Infinity`.
 *
 * This is extremely useful when accepting `unknown` or loosely typed input
 * (e.g. from forms, JSON, APIs) and you need to safely narrow to a real number.
 *
 * @param value - The value to check
 * @returns `true` if the value is a valid finite number, `false` otherwise
 *
 * @template T - Constrained to `number`, allowing narrowing to literal or branded number types
 *
 * @example
 * ```ts
 * if (isValidNumber(maybeNum)) {
 *   maybeNum + 10 // TypeScript knows it's a safe number
 * }
 *
 * declare const input: unknown
 * if (isValidNumber<42 | 100>(input)) {
 *   input // narrowed to 42 | 100
 * }
 *
 * // Common real-world use cases:
 * isValidNumber(42)         // true
 * isValidNumber(3.14)       // true
 * isValidNumber(NaN)        // false
 * isValidNumber(Infinity)   // false
 * isValidNumber('123')      // false
 * isValidNumber(null)       // false
 * ```
 */

function isValidNumber<T extends number>(value: T): boolean
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidNumber(value: any): value is number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidNumber(value: any) {
  return isNumber(value) && !isNaN(value)
}

export default isValidNumber
