/**
 * Type predicate that checks whether a value is exactly `null`.
 *
 * This is a safer and more explicit alternative to `value === null` when you need
 * TypeScript to narrow the type in conditional blocks.
 *
 * @param value - The value to check
 * @returns `true` if the value is `null`, `false` otherwise
 *
 * @example
 * ```ts
 * if (isNull(maybeNull)) {
 *   // TypeScript knows the type is `null` here
 *   console.log(maybeNull) // null
 * }
 *
 * declare const data: string | null | undefined
 * if (isNull(data)) {
 *   data // type narrowed to null
 * }
 * ```
 */

function isNull(value: unknown): value is null {
  return value === null
}

export default isNull
