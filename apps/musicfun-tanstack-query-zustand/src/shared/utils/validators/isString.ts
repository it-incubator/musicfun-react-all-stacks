import getType from './getType'

/**
 * Type predicate that checks whether a value is a string (primitive or String object).
 *
 * Returns `true` for:
 * - Primitive strings: `'hello'`, `` `template` ``, `''`
 * - String objects: `new String('hello')`
 *
 * Returns `false` for everything else (including number-like strings, `null`, `undefined`, etc.).
 *
 * Uses `Object.prototype.toString.call()` internally — the most reliable cross-realm method.
 *
 * @param value - The value to check
 * @returns `true` if the value is a string (primitive or object), `false` otherwise
 *
 * @template TString - A type that extends `string` (e.g. literal types like `'admin' | 'user'`, template literal types, branded strings)
 *
 * @example
 * ```ts
 * if (isString(maybeStr)) {
 *   maybeStr.toUpperCase() // TypeScript knows it's a string
 *   maybeStr.length         // fully typed
 * }
 *
 * declare const role: unknown
 * if (isString<'admin' | 'user'>(role)) {
 *   role // TypeScript narrows to 'admin' | 'user'
 *   console.log(`Role: ${role}`)
 * }
 *
 * isString('hello')         // true
 * isString(new String('hi')) // true
 * isString(123)             // false
 * isString(String(123))     // true — because String(123) returns a primitive string
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isString<TString extends string>(value: any): value is TString {
  return getType(value) === '[object String]'
}

export default isString
