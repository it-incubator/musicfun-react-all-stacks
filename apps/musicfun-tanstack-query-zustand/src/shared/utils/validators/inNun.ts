/**
 * Checks whether a value is `NaN` (Not-a-Number).
 *
 * Uses the built-in `Number.isNaN()` which is the correct and safe way in modern JavaScript.
 * Unlike the global `isNaN()`, this function:
 * - Does **not** coerce non-numbers to numbers
 * - Returns `true` **only** when the value is actually the `number` type and is `NaN`
 *
 * @param value - The value to check (must be of type `number`)
 * @returns `true` if the value is `NaN`, `false` otherwise
 *
 * @example
 * ```ts
 * isNaN(42)            // false
 * isNaN(NaN)           // true
 * isNaN('hello')       // TypeScript error (correctly prevented)
 * isNaN(Number('abc')) // true — because Number('abc') is NaN
 *
 * const result = Math.sqrt(-1)
 * if (isNaN(result)) {
 *   console.log('Invalid calculation') // This will run
 * }
 * ```
 */

function isNaN(value: number) {
  return Number.isNaN(value)
}

export default isNaN
