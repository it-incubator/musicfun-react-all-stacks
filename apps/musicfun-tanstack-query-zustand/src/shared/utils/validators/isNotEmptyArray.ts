import { isArray } from '@/shared/utils/validators/index.ts'

// Version 1

export function isNotEmptyArray(array?: unknown[]): array is unknown[] {
  return !!array && array.length > 0
}

// if (isNotEmptyArray(data)) {
//   data.push(42) // <- Runtime Error! data — not array!
// }

//=================================================================

// Version 2

/**
 * Type predicate that checks whether a value is a non-empty array.
 *
 * Unlike simple `array?.length > 0`, this function:
 * - Properly checks that the value is actually an array (not array-like)
 * - Protects against `null`, `undefined`, objects with `length`, etc.
 * - Allows full generic narrowing
 *
 * @template T - Type of array elements
 */
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function isNotEmptyArray<T>(value: any): value is T[]
// function isNotEmptyArray<T>(value: T[]): value is T[]
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function isNotEmptyArray(value: any): boolean {
//   return isArray(value) && value.length > 0
// }

// if (isValidArray(data)) {
//   data.push(42) // <- TypeScript guaranteed that is an array
// }

export default isNotEmptyArray
