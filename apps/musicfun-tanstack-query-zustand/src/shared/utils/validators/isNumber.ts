import getType from './getType'

/**
 * Type predicate that checks whether a value is a real number (primitive or Number object).
 *
 * Returns `true` for:
 * - Primitive numbers: `42`, `0.5`, `NaN`, `Infinity`, `-Infinity`
 * - Number objects: `new Number(42)`
 *
 * Returns `false` for everything else (including number-like strings).
 *
 * **Note:** Unlike `typeof value === 'number'`, this function returns `false` for `NaN` being a Number object,
 * but `true` for `NaN` because `Object.prototype.toString.call(NaN)` returns `'[object Number]'`.
 * This matches the behavior of `typeof` for `NaN` (which is considered a number in JS).
 *
 * @param value - The value to check
 * @returns `true` if the value is a number (including `NaN` and `±Infinity`), `false` otherwise
 *
 * @template T - A type that extends `number` (e.g. literal types like `42`, branded types, etc.)
 *
 * @example
 * ```ts
 * if (isNumber(maybeNum)) {
 *   console.log(maybeNum.toFixed(2)) // TypeScript knows it's a number
 * }
 *
 * declare const input: unknown
 * if (isNumber(input)) {
 *   input + 10 // fully typed as number
 * }
 *
 * // Works with literal types
 * declare const status: unknown
 * if (isNumber<404 | 500>(status)) {
 *   status satisfies 404 | 500 // narrowed correctly
 * }
 * ```
 */

function isNumber<T extends number>(value: unknown): value is T {
  return getType(value) === '[object Number]'
}

export default isNumber
